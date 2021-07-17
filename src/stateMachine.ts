import { createMachine, assign } from "xstate";

export enum EXERCISE_CURSOR_POSITION {
  NOT_STARTED = -1,
  FIRST_LETTER = 0
}

export enum eventTypes {
  EXERCISE_SELECTED = "EXERCISE_SELECTED",
  KEY_PRESSED = "KEY_PRESSED"
}

export enum stateTypes {
  DEFAULT = "DEFAULT",
  EXERCISE_PROGRESS = "EXERCISE_PROGRESS",
  EXERCISE_SELECTED = "EXERCISE_SELECTED",
  EXERCISE_NOT_STARTED = "EXERCISE_NOT_STARTED",
  EXERCISE_ONGOING = "EXERCISE_ONGOING",
  EXERCISE_FINISHED = "EXERCISE_FINISHED",
  EXERCISE_TIMER = "EXERCISE_TIMER",
  TIMER_OFF = "TIMER_OFF",
  TIMER_ONGOING = "TIMER_ONGOING",
  TIMER_STOPPED = "TIMER_STOPPED"
}

enum actionTypes {
  SET_EXERCISE_DATA = "SET_EXERCISE_DATA",
  SET_CURSOR_TO_NOT_STARTED = "SET_CURSOR_TO_NOT_STARTED",
  SET_CURSOR_TO_FIRST_LETTER = "SET_CURSOR_TO_FIRST_LETTER",
  MOVE_CURSOR_BY_ONE = "MOVE_CURSOR_BY_ONE",
  ADD_ONE_TO_ELAPSED_SECONDS = "ADD_ONE_TO_ELAPSED_SECONDS",
  RESET_ELAPSED_TIME_TO_0 = "RESET_ELAPSED_TIME_TO_0",
  CALCULATE_GROSS_KEYWORDS_TYPED = "CALCULATE_GROSS_KEYWORDS_TYPED",
  CALCULATE_NET_KEYWORDS_TYPED = "CALCULATE_NET_KEYWORDS_TYPED",
  INCREASE_ERRORS_BY_ONE = "INCREASE_ERRORS_BY_ONE",
  RESET_ERRORS_TO_0 = "RESET_ERRORS_TO_0",
  RESET_GROSS_KEYWORDS_TYPED_TO_0 = "RESET_GROSS_KEYWORDS_TYPED_TO_0",
  RESET_NET_KEYWORDS_TYPED_TO_0 = "RESET_NET_KEYWORDS_TYPED_TO_0"
}

enum guardTypes {
  ENTER_WAS_PRESSED = "ENTER_WAS_PRESSED",
  PRESSED_CORRECT_LETTER = "PRESSED_CORRECT_LETTER",
  PRESSED_CORRECT_LETTER_AND_IS_AT_LAST_LETTER = "PRESSED_CORRECT_LETTER_AND_IS_AT_LAST_LETTER"
}

interface stateContext {
  // ----------------- global settings -----------------
  minSpeed?: number; // fixed number or depends on the exercise settings
  // maximum amount of errors allowed (%):
  // fixed number or depends on the exercise settings
  errorsCoefficient: number;
  defaultErrorsCoefficient: number;
  isKeyboardGloballyVisible?: boolean; // always show, never show, or depends on the exercise settings
  isTutorGloballyActive?: boolean; // always active, never active, or depends on the exercise settings

  // ---- options -----
  soundOnKeysTap: boolean;
  soundOnError: boolean;
  infoPanelOnTheLeft: boolean;
  showResultsWhileDoingExercise: boolean;

  // ----------------- exercise data -----------------
  selectedLessonText?: string;
  lessonCategory?: string;
  lessonNumber?: number;
  exerciseCursorPosition: number;
  exerciseNumber?: number;
  minimumWPMNeededToCompleteExerciseSuccessfully: number;
  isTutorActiveForThisExercise?: boolean;
  isKeyboardVisibleForThisExercise?: boolean;
  totalNetKeystrokes?: number;
  totalGrossKeystrokes?: number;
  errors: number;
  elapsedSeconds: number;
}

type ExerciseSelectedEvent = {
  type: eventTypes.EXERCISE_SELECTED;
  selectedLessonText: string;
  lessonCategory: string;
  lessonNumber?: number;
  exerciseNumber: number;
  isTutorActive: boolean;
  isKeyboardVisible: boolean;
  exerciseMinimumSpeed: number;
};

type KeyPressedEvent = {
  type: eventTypes.KEY_PRESSED;
  key: string;
};

type stateEvents = ExerciseSelectedEvent | KeyPressedEvent;

function totalNetKeystrokesTyped(totalKeystrokes: number, errors: number) {
  return totalKeystrokes - errors;
}

function totalGrossKeystrokesTyped(totalKeystrokes: number, errors: number) {
  return totalKeystrokes + errors;
}

export const stateMachine = createMachine<stateContext, stateEvents>(
  {
    initial: stateTypes.DEFAULT,
    context: {
      exerciseCursorPosition: EXERCISE_CURSOR_POSITION.NOT_STARTED,
      minimumWPMNeededToCompleteExerciseSuccessfully: 20,
      elapsedSeconds: 0,
      errors: 0,
      // global settings
      defaultErrorsCoefficient: 2,
      errorsCoefficient: 2, // TODO: load this from user settings,
      soundOnKeysTap: false,
      soundOnError: false,
      infoPanelOnTheLeft: false,
      showResultsWhileDoingExercise: false
    },
    states: {
      [stateTypes.DEFAULT]: {},
      [stateTypes.EXERCISE_SELECTED]: {
        entry: [
          actionTypes.RESET_ELAPSED_TIME_TO_0,
          actionTypes.RESET_ERRORS_TO_0,
          actionTypes.RESET_GROSS_KEYWORDS_TYPED_TO_0,
          actionTypes.RESET_NET_KEYWORDS_TYPED_TO_0
        ],
        type: "parallel",
        states: {
          [stateTypes.EXERCISE_PROGRESS]: {
            initial: stateTypes.EXERCISE_NOT_STARTED,
            entry: actionTypes.SET_CURSOR_TO_NOT_STARTED,
            states: {
              [stateTypes.EXERCISE_NOT_STARTED]: {
                on: {
                  [eventTypes.KEY_PRESSED]: {
                    target: stateTypes.EXERCISE_ONGOING,
                    cond: guardTypes.ENTER_WAS_PRESSED,
                    actions: actionTypes.SET_CURSOR_TO_FIRST_LETTER
                  }
                }
              },
              [stateTypes.EXERCISE_ONGOING]: {
                on: {
                  [eventTypes.KEY_PRESSED]: [
                    {
                      target: stateTypes.EXERCISE_FINISHED,
                      cond: guardTypes.PRESSED_CORRECT_LETTER_AND_IS_AT_LAST_LETTER,
                      actions: [
                        actionTypes.MOVE_CURSOR_BY_ONE,
                        actionTypes.CALCULATE_GROSS_KEYWORDS_TYPED,
                        actionTypes.CALCULATE_NET_KEYWORDS_TYPED
                      ]
                    },
                    {
                      target: stateTypes.EXERCISE_ONGOING,
                      cond: guardTypes.PRESSED_CORRECT_LETTER,
                      actions: [
                        actionTypes.MOVE_CURSOR_BY_ONE,
                        actionTypes.CALCULATE_GROSS_KEYWORDS_TYPED,
                        actionTypes.CALCULATE_NET_KEYWORDS_TYPED
                      ]
                    },
                    {
                      target: stateTypes.EXERCISE_ONGOING,
                      actions: [
                        actionTypes.INCREASE_ERRORS_BY_ONE,
                        actionTypes.CALCULATE_GROSS_KEYWORDS_TYPED,
                        actionTypes.CALCULATE_NET_KEYWORDS_TYPED
                      ]
                    }
                  ]
                }
              },
              [stateTypes.EXERCISE_FINISHED]: {}
            }
          },
          [stateTypes.EXERCISE_TIMER]: {
            initial: stateTypes.TIMER_OFF,
            states: {
              [stateTypes.TIMER_OFF]: {
                on: {
                  [eventTypes.KEY_PRESSED]: {
                    target: stateTypes.TIMER_ONGOING,
                    cond: guardTypes.ENTER_WAS_PRESSED
                  }
                }
              },
              [stateTypes.TIMER_ONGOING]: {
                after: {
                  1000: {
                    target: stateTypes.TIMER_ONGOING,
                    actions: actionTypes.ADD_ONE_TO_ELAPSED_SECONDS
                  }
                },
                on: {
                  [eventTypes.KEY_PRESSED]: {
                    target: stateTypes.TIMER_STOPPED,
                    cond: guardTypes.PRESSED_CORRECT_LETTER_AND_IS_AT_LAST_LETTER
                  }
                }
              },
              [stateTypes.TIMER_STOPPED]: {}
            }
          }
        }
      }
    },
    on: {
      [eventTypes.EXERCISE_SELECTED]: {
        target: stateTypes.EXERCISE_SELECTED,
        actions: actionTypes.SET_EXERCISE_DATA
      }
    }
  },
  {
    actions: {
      [actionTypes.SET_EXERCISE_DATA]: assign((_, event) => {
        const {
          exerciseNumber,
          lessonCategory,
          selectedLessonText,
          lessonNumber,
          isKeyboardVisible,
          isTutorActive,
          exerciseMinimumSpeed
        } = event as ExerciseSelectedEvent;

        return {
          exerciseNumber,
          lessonCategory,
          selectedLessonText,
          lessonNumber,
          isTutorActiveForThisExercise: isTutorActive,
          isKeyboardVisibleForThisExercise: isKeyboardVisible,
          minimumWPMNeededToCompleteExerciseSuccessfully: exerciseMinimumSpeed
        };
      }),
      [actionTypes.SET_CURSOR_TO_NOT_STARTED]: assign((_) => ({
        exerciseCursorPosition: EXERCISE_CURSOR_POSITION.NOT_STARTED
      })),
      [actionTypes.MOVE_CURSOR_BY_ONE]: assign((ctx) => ({
        exerciseCursorPosition: ctx.exerciseCursorPosition + 1
      })),
      [actionTypes.SET_CURSOR_TO_FIRST_LETTER]: assign((_) => ({
        exerciseCursorPosition: EXERCISE_CURSOR_POSITION.FIRST_LETTER
      })),
      [actionTypes.ADD_ONE_TO_ELAPSED_SECONDS]: assign((ctx) => ({
        elapsedSeconds: ctx.elapsedSeconds + 1
      })),
      [actionTypes.RESET_ELAPSED_TIME_TO_0]: assign((_) => ({
        elapsedSeconds: 0
      })),
      [actionTypes.CALCULATE_GROSS_KEYWORDS_TYPED]: assign((ctx) => ({
        totalNetKeystrokes: totalNetKeystrokesTyped(
          ctx.exerciseCursorPosition,
          ctx.errors
        )
      })),
      [actionTypes.CALCULATE_NET_KEYWORDS_TYPED]: assign((ctx) => ({
        totalGrossKeystrokes: totalGrossKeystrokesTyped(
          ctx.exerciseCursorPosition,
          ctx.errors
        )
      })),
      [actionTypes.INCREASE_ERRORS_BY_ONE]: assign((ctx) => ({
        errors: ctx.errors + 1
      })),
      [actionTypes.RESET_GROSS_KEYWORDS_TYPED_TO_0]: assign((ctx) => ({
        totalGrossKeystrokes: 0
      })),
      [actionTypes.RESET_NET_KEYWORDS_TYPED_TO_0]: assign((ctx) => ({
        totalNetKeystrokes: 0
      })),
      [actionTypes.RESET_ERRORS_TO_0]: assign((ctx) => ({
        errors: 0
      }))
    },
    guards: {
      [guardTypes.ENTER_WAS_PRESSED]: (_, event) => {
        const { key } = event as KeyPressedEvent;
        return key === "Enter";
      },
      [guardTypes.PRESSED_CORRECT_LETTER]: (ctx, event) => {
        const { key } = event as KeyPressedEvent;
        return key === ctx.selectedLessonText?.[ctx.exerciseCursorPosition];
      },
      [guardTypes.PRESSED_CORRECT_LETTER_AND_IS_AT_LAST_LETTER]: (
        ctx,
        event
      ) => {
        const { key } = event as KeyPressedEvent;
        return (
          key === ctx.selectedLessonText?.[ctx.exerciseCursorPosition] &&
          ctx.selectedLessonText?.length - 1 === ctx.exerciseCursorPosition
        );
      }
    }
  }
);
