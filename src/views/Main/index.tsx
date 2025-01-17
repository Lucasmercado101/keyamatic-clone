import { useEffect, useRef } from "react";
import { Event, EventData, SingleOrArray, State } from "xstate";
import {
  eventTypes,
  EXERCISE_CURSOR_POSITION,
  stateContext,
  stateEvents
} from "../../globalStateMachine/stateMachine";
import { makeStyles } from "@material-ui/styles";
import TopToolbar from "./TopToolbar";
import InfoPanel from "./InfoPanel";
const electron = window?.require?.("electron");

enum KEY_FINGER_COLORS {
  PINKY = "#ffffc0",
  RING_FINGER = "#c0ffc0",
  MIDDLE_FINGER = "#c0ffff",
  INDEX_LEFT_HAND = "#ffc0ff",
  INDEX_RIGHT_HAND = "#ff96ff"
}

const useStyles = makeStyles({
  enterBottom: ({
    isTutorActiveCurrently,
    isEnterHighlighted
  }: {
    isTutorActiveCurrently: boolean;
    isEnterHighlighted: boolean;
  }) => ({
    position: "relative",
    "&::after": {
      content: "''",
      position: "absolute",
      right: -3,
      left: -3,
      top: 0,
      bottom: 10,
      backgroundColor: isEnterHighlighted
        ? "#ff8080"
        : isTutorActiveCurrently
        ? KEY_FINGER_COLORS.PINKY
        : "#e0e0e0",
      borderLeft: "3px solid #808080",
      borderRight: "3px solid #808080",
      transform: "translateY(-65%)"
    }
  })
});

interface KeyProps {
  letter?: React.ReactElement | string;
  color?: string;
  isSelected?: boolean;
  isHighlighted?: boolean;
  style?: React.CSSProperties | null;
}

function Key({
  color,
  letter,
  style,
  isHighlighted,
  ...otherProps
}: KeyProps & React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      {...otherProps}
      style={{
        backgroundColor: isHighlighted ? "#ff8080" : color || "#e0e0e0",
        width: 32,
        height: 32,
        border: "3px solid #808080",
        borderRadius: "4px",
        textAlign: "center",
        paddingTop: 3,
        ...style
      }}
    >
      {letter}
    </div>
  );
}

interface Props {
  send: (
    event: SingleOrArray<Event<stateEvents>>,
    payload?: EventData | undefined
  ) => void;
  state: State<
    stateContext,
    stateEvents,
    any,
    {
      value: any;
      context: stateContext;
    }
  >;
}

function Index({ send, state }: Props) {
  useEffect(() => {
    electron.ipcRenderer.send("is-on-main-view");
  }, []);

  const myRef = useRef<null | HTMLElement>(null);
  const textContainerDiv = useRef<null | HTMLDivElement>(null);

  const executeScroll = () => myRef?.current?.scrollIntoView();

  const {
    selectedLessonText,
    exerciseCursorPosition,
    // isKeyboardVisibleForThisExercise,
    isTutorActiveForThisExercise = true, // if no exercise selected then by default true
    // global settings
    isTutorGloballyActive
  } = state.context;

  useEffect(() => {
    if (textContainerDiv?.current) {
      textContainerDiv.current.scrollTop = 0;
    }
  }, [selectedLessonText]);

  const isTutorActiveCurrently = isTutorGloballyActive
    ? true
    : !isTutorGloballyActive
    ? false
    : isTutorActiveForThisExercise;

  const classes = useStyles({
    isTutorActiveCurrently,
    isEnterHighlighted:
      exerciseCursorPosition === EXERCISE_CURSOR_POSITION.NOT_STARTED &&
      !!selectedLessonText
  });

  return (
    <div
      onKeyDown={({ key, altKey, ctrlKey }) => {
        executeScroll();
        // NOTE "key" does not pick up dead key modifier keys ( "´" , "^", "`")
        send({
          type: eventTypes.KEY_PRESSED,
          key,
          pressedAltKey: altKey,
          pressedCtrlKey: ctrlKey
        });
      }}
      tabIndex={0}
      style={{
        backgroundColor: "#c0c0c0",
        display: "flex",
        minHeight: "100vh"
      }}
    >
      <div style={{ display: "flex", flexDirection: "column" }}>
        <TopToolbar state={state} send={send} />
        <div style={{ display: "flex", gap: 15, padding: "10px 0px 0px 25px" }}>
          <div style={{ display: "flex", flexDirection: "column" }}>
            <div
              ref={textContainerDiv}
              style={{
                backgroundColor: "#008282",
                color: "white",
                overflow: "auto",
                height: 210,
                width: 570,
                border: "thin solid",
                borderStyle: "inset"
              }}
            >
              {selectedLessonText ? (
                <div
                  style={{
                    fontSize: "1.3rem",
                    padding: 4
                  }}
                >
                  {Array.from(selectedLessonText).map((letter, i) => (
                    <span
                      key={i}
                      style={{
                        color: exerciseCursorPosition > i ? "black" : "",
                        backgroundColor:
                          exerciseCursorPosition === i
                            ? "#ff8a7e"
                            : "transparent",
                        whiteSpace: "break-spaces",
                        fontFamily: `monospace`
                      }}
                      ref={exerciseCursorPosition === i ? myRef : null}
                    >
                      {letter}
                    </span>
                  ))}
                </div>
              ) : (
                <div
                  style={{
                    fontSize: "1.5rem",
                    width: "100%",
                    height: "100%",
                    display: "grid",
                    placeItems: "center"
                  }}
                >
                  Bienvenido a MecaMatic 3.0
                </div>
              )}
            </div>

            {/* Keyboard */}
            <div
              style={{
                width: 570,
                height: 208,
                marginTop: 40,
                border: "9px solid #808080",
                display: "flex",
                flexDirection: "column",
                gap: 4,
                padding: 8,
                fontWeight: "bold",
                userSelect: "none"
              }}
            >
              <div style={{ display: "flex", gap: 4 }}>
                <Key
                  color={isTutorActiveCurrently ? KEY_FINGER_COLORS.PINKY : ""}
                  letter={
                    <div
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        position: "relative"
                      }}
                    >
                      <p
                        style={{
                          position: "absolute",
                          fontSize: "0.8rem",
                          left: 4,
                          top: -4
                        }}
                      >
                        a
                      </p>
                      <p style={{ position: "absolute", left: 4, top: 11 }}>
                        °
                      </p>
                      <p
                        style={{
                          position: "absolute",
                          left: 16,
                          top: 7,
                          fontSize: "0.9rem"
                        }}
                      >
                        \
                      </p>
                    </div>
                  }
                />
                <Key
                  isHighlighted={["1", "!"].some(
                    (char) =>
                      selectedLessonText?.[exerciseCursorPosition] === char
                  )}
                  color={isTutorActiveCurrently ? KEY_FINGER_COLORS.PINKY : ""}
                  letter={
                    <div
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        position: "relative"
                      }}
                    >
                      <p
                        style={{
                          position: "absolute",
                          left: 5,
                          top: -3,
                          fontSize: "0.8rem"
                        }}
                      >
                        !
                      </p>
                      <p
                        style={{
                          position: "absolute",
                          left: 4,
                          top: 10,
                          fontSize: "0.7rem"
                        }}
                      >
                        1
                      </p>
                      <p
                        style={{
                          position: "absolute",
                          left: 18,
                          top: 6,
                          fontSize: "0.8rem"
                        }}
                      >
                        |
                      </p>
                    </div>
                  }
                />
                <Key
                  isHighlighted={["2", `"`].some(
                    (char) =>
                      selectedLessonText?.[exerciseCursorPosition] === char
                  )}
                  color={
                    isTutorActiveCurrently ? KEY_FINGER_COLORS.RING_FINGER : ""
                  }
                  letter={
                    <div
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        position: "relative"
                      }}
                    >
                      <p style={{ position: "absolute", left: 5, top: -2 }}>
                        "
                      </p>
                      <p
                        style={{
                          position: "absolute",
                          left: 4,
                          top: 8,
                          fontSize: "0.8rem"
                        }}
                      >
                        2
                      </p>
                      <p
                        style={{
                          position: "absolute",
                          left: 14,
                          top: 8,
                          fontSize: "0.6rem"
                        }}
                      >
                        @
                      </p>
                    </div>
                  }
                />
                <Key
                  isHighlighted={["3", `#`].some(
                    (char) =>
                      selectedLessonText?.[exerciseCursorPosition] === char
                  )}
                  color={
                    isTutorActiveCurrently
                      ? KEY_FINGER_COLORS.MIDDLE_FINGER
                      : ""
                  }
                  letter={
                    <div
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        position: "relative"
                      }}
                    >
                      <p style={{ position: "absolute", left: 5, top: -10 }}>
                        .
                      </p>
                      <p
                        style={{
                          position: "absolute",
                          left: 4,
                          top: 7,
                          fontSize: "0.8rem"
                        }}
                      >
                        3
                      </p>
                      <p
                        style={{
                          position: "absolute",
                          left: 16,
                          top: 8,
                          fontSize: "0.7rem"
                        }}
                      >
                        #
                      </p>
                    </div>
                  }
                />
                <Key
                  isHighlighted={["4", `$`].some(
                    (char) =>
                      selectedLessonText?.[exerciseCursorPosition] === char
                  )}
                  color={
                    isTutorActiveCurrently
                      ? KEY_FINGER_COLORS.INDEX_LEFT_HAND
                      : ""
                  }
                  letter={
                    <div
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        position: "relative"
                      }}
                    >
                      <p
                        style={{
                          position: "absolute",
                          left: 6,
                          top: -3,
                          fontSize: "0.8rem"
                        }}
                      >
                        $
                      </p>
                      <p
                        style={{
                          position: "absolute",
                          left: 5,
                          top: 9,
                          fontSize: "0.8rem"
                        }}
                      >
                        4
                      </p>
                    </div>
                  }
                />
                <Key
                  isHighlighted={["5", `%`].some(
                    (char) =>
                      selectedLessonText?.[exerciseCursorPosition] === char
                  )}
                  color={
                    isTutorActiveCurrently
                      ? KEY_FINGER_COLORS.INDEX_LEFT_HAND
                      : ""
                  }
                  letter={
                    <div
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        position: "relative"
                      }}
                    >
                      <p
                        style={{
                          position: "absolute",
                          left: 5,
                          top: -3,
                          fontSize: "0.7rem"
                        }}
                      >
                        %
                      </p>
                      <p
                        style={{
                          position: "absolute",
                          left: 5,
                          top: 9,
                          fontSize: "0.8rem"
                        }}
                      >
                        5
                      </p>
                    </div>
                  }
                />
                <Key
                  isHighlighted={["6", `&`].some(
                    (char) =>
                      selectedLessonText?.[exerciseCursorPosition] === char
                  )}
                  color={
                    isTutorActiveCurrently
                      ? KEY_FINGER_COLORS.INDEX_RIGHT_HAND
                      : ""
                  }
                  letter={
                    <div
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        position: "relative"
                      }}
                    >
                      <p
                        style={{
                          position: "absolute",
                          left: 5,
                          top: -3,
                          fontSize: "1.3rem"
                        }}
                      >
                        °
                      </p>
                      <p
                        style={{
                          position: "absolute",
                          left: 6,
                          top: 9,
                          fontSize: "0.8rem"
                        }}
                      >
                        6
                      </p>
                    </div>
                  }
                />
                <Key
                  isHighlighted={["7", `/`].some(
                    (char) =>
                      selectedLessonText?.[exerciseCursorPosition] === char
                  )}
                  color={
                    isTutorActiveCurrently
                      ? KEY_FINGER_COLORS.INDEX_RIGHT_HAND
                      : ""
                  }
                  letter={
                    <div
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        position: "relative"
                      }}
                    >
                      <p
                        style={{
                          position: "absolute",
                          left: 6,
                          top: -3,
                          fontSize: "0.8rem"
                        }}
                      >
                        /
                      </p>
                      <p
                        style={{
                          position: "absolute",
                          left: 5,
                          top: 9,
                          fontSize: "0.8rem"
                        }}
                      >
                        7
                      </p>
                    </div>
                  }
                />
                <Key
                  isHighlighted={["8", `(`].some(
                    (char) =>
                      selectedLessonText?.[exerciseCursorPosition] === char
                  )}
                  color={
                    isTutorActiveCurrently
                      ? KEY_FINGER_COLORS.MIDDLE_FINGER
                      : ""
                  }
                  letter={
                    <div
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        position: "relative"
                      }}
                    >
                      <p
                        style={{
                          position: "absolute",
                          left: 5,
                          top: -3,
                          fontSize: "0.7rem"
                        }}
                      >
                        (
                      </p>
                      <p
                        style={{
                          position: "absolute",
                          left: 5,
                          top: 9,
                          fontSize: "0.8rem"
                        }}
                      >
                        8
                      </p>
                    </div>
                  }
                />
                <Key
                  isHighlighted={["9", `)`].some(
                    (char) =>
                      selectedLessonText?.[exerciseCursorPosition] === char
                  )}
                  color={
                    isTutorActiveCurrently ? KEY_FINGER_COLORS.RING_FINGER : ""
                  }
                  letter={
                    <div
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        position: "relative"
                      }}
                    >
                      <p
                        style={{
                          position: "absolute",
                          left: 5,
                          top: -3,
                          fontSize: "0.7rem"
                        }}
                      >
                        )
                      </p>
                      <p
                        style={{
                          position: "absolute",
                          left: 5,
                          top: 9,
                          fontSize: "0.8rem"
                        }}
                      >
                        9
                      </p>
                    </div>
                  }
                />
                <Key
                  isHighlighted={["0", `=`].some(
                    (char) =>
                      selectedLessonText?.[exerciseCursorPosition] === char
                  )}
                  color={isTutorActiveCurrently ? KEY_FINGER_COLORS.PINKY : ""}
                  letter={
                    <div
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        position: "relative"
                      }}
                    >
                      <p
                        style={{
                          position: "absolute",
                          left: 5,
                          top: -3,
                          fontSize: "0.7rem"
                        }}
                      >
                        =
                      </p>
                      <p
                        style={{
                          position: "absolute",
                          left: 5,
                          top: 9,
                          fontSize: "0.8rem"
                        }}
                      >
                        0
                      </p>
                    </div>
                  }
                />
                <Key
                  isHighlighted={["?", "'", "\\"].some(
                    (char) =>
                      selectedLessonText?.[exerciseCursorPosition] === char
                  )}
                  color={isTutorActiveCurrently ? KEY_FINGER_COLORS.PINKY : ""}
                  letter={
                    <div
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        position: "relative"
                      }}
                    >
                      <p
                        style={{
                          position: "absolute",
                          left: 5,
                          top: -2,
                          fontSize: "0.8rem"
                        }}
                      >
                        ?
                      </p>
                      <p
                        style={{
                          position: "absolute",
                          left: 5,
                          top: 14,
                          fontSize: "0.8rem"
                        }}
                      >
                        '
                      </p>
                    </div>
                  }
                />
                <Key
                  color={isTutorActiveCurrently ? KEY_FINGER_COLORS.PINKY : ""}
                  isHighlighted={["¿", "¡"].some(
                    (char) =>
                      selectedLessonText?.[exerciseCursorPosition] === char
                  )}
                  letter={
                    <div
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        position: "relative"
                      }}
                    >
                      <p
                        style={{
                          position: "absolute",
                          left: 5,
                          top: -6,
                          fontSize: "0.8rem"
                        }}
                      >
                        ¿
                      </p>
                      <p
                        style={{
                          position: "absolute",
                          left: 8,
                          top: 8,
                          fontSize: "0.7rem"
                        }}
                      >
                        ¡
                      </p>
                    </div>
                  }
                />
                <Key
                  style={{
                    width: 68,
                    textAlign: "left",
                    paddingLeft: 4,
                    fontSize: "1.1rem"
                  }}
                  letter={<div style={{ marginTop: -5 }}>&larr;</div>}
                />
              </div>

              <div style={{ display: "flex", gap: 4 }}>
                <Key
                  color={isTutorActiveCurrently ? KEY_FINGER_COLORS.PINKY : ""}
                  style={{
                    width: 48,
                    fontSize: "1.1em",
                    textAlign: "left",
                    paddingLeft: 5,
                    paddingTop: 0
                  }}
                  letter="&#11134;"
                />
                <Key
                  isHighlighted={
                    selectedLessonText?.[
                      exerciseCursorPosition
                    ]?.toLowerCase() === "q"
                  }
                  letter="Q"
                  color={isTutorActiveCurrently ? KEY_FINGER_COLORS.PINKY : ""}
                />
                <Key
                  isHighlighted={
                    selectedLessonText?.[
                      exerciseCursorPosition
                    ]?.toLowerCase() === "w"
                  }
                  letter="W"
                  color={
                    isTutorActiveCurrently ? KEY_FINGER_COLORS.RING_FINGER : ""
                  }
                />
                <Key
                  isHighlighted={
                    selectedLessonText?.[
                      exerciseCursorPosition
                    ]?.toLowerCase() === "e"
                  }
                  letter={
                    <div
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        position: "relative",
                        width: "100%",
                        height: "100%"
                      }}
                    >
                      <p
                        style={{
                          position: "absolute",
                          left: 4,
                          top: 0,
                          fontSize: "1rem"
                        }}
                      >
                        E
                      </p>
                      <p
                        style={{
                          position: "absolute",
                          bottom: 1,
                          right: 2,
                          fontSize: "0.7rem"
                        }}
                      >
                        &euro;
                      </p>
                    </div>
                  }
                  color={
                    isTutorActiveCurrently
                      ? KEY_FINGER_COLORS.MIDDLE_FINGER
                      : ""
                  }
                />
                <Key
                  isHighlighted={
                    selectedLessonText?.[
                      exerciseCursorPosition
                    ]?.toLowerCase() === "r"
                  }
                  letter="R"
                  color={
                    isTutorActiveCurrently
                      ? KEY_FINGER_COLORS.INDEX_LEFT_HAND
                      : ""
                  }
                />
                <Key
                  isHighlighted={
                    selectedLessonText?.[
                      exerciseCursorPosition
                    ]?.toLowerCase() === "t"
                  }
                  letter="T"
                  color={
                    isTutorActiveCurrently
                      ? KEY_FINGER_COLORS.INDEX_LEFT_HAND
                      : ""
                  }
                />
                <Key
                  isHighlighted={
                    selectedLessonText?.[
                      exerciseCursorPosition
                    ]?.toLowerCase() === "y"
                  }
                  letter="Y"
                  color={
                    isTutorActiveCurrently
                      ? KEY_FINGER_COLORS.INDEX_RIGHT_HAND
                      : ""
                  }
                />
                <Key
                  isHighlighted={
                    selectedLessonText?.[
                      exerciseCursorPosition
                    ]?.toLowerCase() === "u"
                  }
                  letter="U"
                  color={
                    isTutorActiveCurrently
                      ? KEY_FINGER_COLORS.INDEX_RIGHT_HAND
                      : ""
                  }
                />
                <Key
                  isHighlighted={
                    selectedLessonText?.[
                      exerciseCursorPosition
                    ]?.toLowerCase() === "i"
                  }
                  letter="I"
                  color={
                    isTutorActiveCurrently
                      ? KEY_FINGER_COLORS.MIDDLE_FINGER
                      : ""
                  }
                />
                <Key
                  isHighlighted={
                    selectedLessonText?.[
                      exerciseCursorPosition
                    ]?.toLowerCase() === "o"
                  }
                  letter="O"
                  color={
                    isTutorActiveCurrently ? KEY_FINGER_COLORS.RING_FINGER : ""
                  }
                />
                <Key
                  isHighlighted={
                    selectedLessonText?.[
                      exerciseCursorPosition
                    ]?.toLowerCase() === "p"
                  }
                  letter="P"
                  color={isTutorActiveCurrently ? KEY_FINGER_COLORS.PINKY : ""}
                />
                <Key
                  color={isTutorActiveCurrently ? KEY_FINGER_COLORS.PINKY : ""}
                  letter={
                    <div
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        position: "relative"
                      }}
                    >
                      <p style={{ position: "absolute", left: 5, top: 1 }}>^</p>
                      <p style={{ position: "absolute", left: 6, top: 13 }}>
                        `
                      </p>
                      <p
                        style={{
                          position: "absolute",
                          left: 16,
                          top: 8,
                          fontSize: "0.7rem"
                        }}
                      >
                        {"["}
                      </p>
                    </div>
                  }
                />
                <Key
                  isHighlighted={["+", "*", "~"].some(
                    (char) =>
                      selectedLessonText?.[exerciseCursorPosition] === char
                  )}
                  color={isTutorActiveCurrently ? KEY_FINGER_COLORS.PINKY : ""}
                  letter={
                    <div
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        position: "relative"
                      }}
                    >
                      <p style={{ position: "absolute", left: 5, top: 0 }}>*</p>
                      <p style={{ position: "absolute", left: 4, top: 7 }}>+</p>
                      <p
                        style={{
                          position: "absolute",
                          left: 18,
                          top: 8,
                          fontSize: "0.7rem"
                        }}
                      >
                        {"]"}
                      </p>
                    </div>
                  }
                />
                <Key
                  color={isTutorActiveCurrently ? KEY_FINGER_COLORS.PINKY : ""}
                  isHighlighted={
                    exerciseCursorPosition ===
                      EXERCISE_CURSOR_POSITION.NOT_STARTED &&
                    !!selectedLessonText
                  }
                  style={{
                    width: 52,
                    fontSize: "0.7rem",
                    display: "grid",
                    placeItems: "center",
                    paddingBottom: 4
                  }}
                  letter="Enter"
                />
              </div>

              <div style={{ display: "flex", gap: 4 }}>
                <Key
                  color={isTutorActiveCurrently ? KEY_FINGER_COLORS.PINKY : ""}
                  style={{
                    width: 59,
                    fontSize: "0.9rem",
                    textAlign: "left",
                    padding: 4
                  }}
                  letter="Mayús"
                />
                <Key
                  isHighlighted={
                    selectedLessonText?.[
                      exerciseCursorPosition
                    ]?.toLowerCase() === "a"
                  }
                  letter="A"
                  color={isTutorActiveCurrently ? KEY_FINGER_COLORS.PINKY : ""}
                />
                <Key
                  isHighlighted={
                    selectedLessonText?.[
                      exerciseCursorPosition
                    ]?.toLowerCase() === "s"
                  }
                  letter="S"
                  color={
                    isTutorActiveCurrently ? KEY_FINGER_COLORS.RING_FINGER : ""
                  }
                />
                <Key
                  isHighlighted={
                    selectedLessonText?.[
                      exerciseCursorPosition
                    ]?.toLowerCase() === "d"
                  }
                  letter="D"
                  color={
                    isTutorActiveCurrently
                      ? KEY_FINGER_COLORS.MIDDLE_FINGER
                      : ""
                  }
                />
                <Key
                  isHighlighted={
                    selectedLessonText?.[
                      exerciseCursorPosition
                    ]?.toLowerCase() === "f"
                  }
                  color={
                    isTutorActiveCurrently
                      ? KEY_FINGER_COLORS.INDEX_LEFT_HAND
                      : ""
                  }
                  letter={
                    <div style={{ lineHeight: 0.3, paddingTop: 5 }}>
                      F <br /> _
                    </div>
                  }
                />
                <Key
                  isHighlighted={
                    selectedLessonText?.[
                      exerciseCursorPosition
                    ]?.toLowerCase() === "g"
                  }
                  letter="G"
                  color={
                    isTutorActiveCurrently
                      ? KEY_FINGER_COLORS.INDEX_LEFT_HAND
                      : ""
                  }
                />
                <Key
                  isHighlighted={
                    selectedLessonText?.[
                      exerciseCursorPosition
                    ]?.toLowerCase() === "h"
                  }
                  letter="H"
                  color={
                    isTutorActiveCurrently
                      ? KEY_FINGER_COLORS.INDEX_RIGHT_HAND
                      : ""
                  }
                />
                <Key
                  isHighlighted={
                    selectedLessonText?.[
                      exerciseCursorPosition
                    ]?.toLowerCase() === "j"
                  }
                  color={
                    isTutorActiveCurrently
                      ? KEY_FINGER_COLORS.INDEX_RIGHT_HAND
                      : ""
                  }
                  letter={
                    <div style={{ lineHeight: 0.3, paddingTop: 5 }}>
                      J <br /> _
                    </div>
                  }
                />
                <Key
                  isHighlighted={
                    selectedLessonText?.[
                      exerciseCursorPosition
                    ]?.toLowerCase() === "k"
                  }
                  letter="K"
                  color={
                    isTutorActiveCurrently
                      ? KEY_FINGER_COLORS.MIDDLE_FINGER
                      : ""
                  }
                />
                <Key
                  isHighlighted={
                    selectedLessonText?.[
                      exerciseCursorPosition
                    ]?.toLowerCase() === "l"
                  }
                  letter="L"
                  color={
                    isTutorActiveCurrently ? KEY_FINGER_COLORS.RING_FINGER : ""
                  }
                />
                <Key
                  isHighlighted={
                    selectedLessonText?.[
                      exerciseCursorPosition
                    ]?.toLowerCase() === "ñ"
                  }
                  letter="Ñ"
                  color={isTutorActiveCurrently ? KEY_FINGER_COLORS.PINKY : ""}
                />
                <Key
                  isHighlighted={
                    selectedLessonText?.[
                      exerciseCursorPosition
                    ]?.toLowerCase() === "{"
                  }
                  color={isTutorActiveCurrently ? KEY_FINGER_COLORS.PINKY : ""}
                  letter={
                    <div
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        position: "relative"
                      }}
                    >
                      <p style={{ position: "absolute", left: 6, top: 2 }}>¨</p>
                      <p style={{ position: "absolute", left: 4, top: 13 }}>
                        ´
                      </p>
                      <p
                        style={{
                          position: "absolute",
                          left: 16,
                          top: 8,
                          fontSize: "0.7rem"
                        }}
                      >
                        {"{"}
                      </p>
                    </div>
                  }
                />
                <Key
                  isHighlighted={
                    selectedLessonText?.[
                      exerciseCursorPosition
                    ]?.toLowerCase() === "}"
                  }
                  color={isTutorActiveCurrently ? KEY_FINGER_COLORS.PINKY : ""}
                  letter={
                    <div
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        position: "relative"
                      }}
                    >
                      <p
                        style={{
                          position: "absolute",
                          left: 5,
                          top: -3,
                          fontSize: "0.8rem"
                        }}
                      >
                        ç
                      </p>
                      <p
                        style={{
                          position: "absolute",
                          left: 16,
                          top: 4,
                          fontSize: "0.8rem"
                        }}
                      >
                        {"}"}
                      </p>
                    </div>
                  }
                />
                <Key
                  color={isTutorActiveCurrently ? KEY_FINGER_COLORS.PINKY : ""}
                  className={classes.enterBottom}
                  style={{ width: 41, paddingTop: 7 }}
                  letter="&crarr;"
                  isHighlighted={
                    exerciseCursorPosition ===
                      EXERCISE_CURSOR_POSITION.NOT_STARTED &&
                    !!selectedLessonText
                  }
                />
              </div>

              <div style={{ display: "flex", gap: 4 }}>
                <Key
                  isHighlighted={[";", ":", "_"].some(
                    (char) =>
                      selectedLessonText?.[exerciseCursorPosition] === char
                  )}
                  color={isTutorActiveCurrently ? KEY_FINGER_COLORS.PINKY : ""}
                  style={{
                    width: 44,
                    fontSize: "0.9rem",
                    textAlign: "left",
                    padding: 4
                  }}
                  letter="&#8679;"
                />
                <Key
                  color={isTutorActiveCurrently ? KEY_FINGER_COLORS.PINKY : ""}
                  isHighlighted={["<", ">"].some(
                    (char) =>
                      selectedLessonText?.[exerciseCursorPosition] === char
                  )}
                  letter={
                    <div style={{ lineHeight: 0.65 }}>
                      &gt; <br /> &lt;
                    </div>
                  }
                />
                <Key
                  isHighlighted={
                    selectedLessonText?.[
                      exerciseCursorPosition
                    ]?.toLowerCase() === "z"
                  }
                  letter="Z"
                  color={isTutorActiveCurrently ? KEY_FINGER_COLORS.PINKY : ""}
                />
                <Key
                  isHighlighted={
                    selectedLessonText?.[
                      exerciseCursorPosition
                    ]?.toLowerCase() === "x"
                  }
                  letter="X"
                  color={
                    isTutorActiveCurrently ? KEY_FINGER_COLORS.RING_FINGER : ""
                  }
                />
                <Key
                  isHighlighted={
                    selectedLessonText?.[
                      exerciseCursorPosition
                    ]?.toLowerCase() === "c"
                  }
                  letter="C"
                  color={
                    isTutorActiveCurrently
                      ? KEY_FINGER_COLORS.MIDDLE_FINGER
                      : ""
                  }
                />
                <Key
                  isHighlighted={
                    selectedLessonText?.[
                      exerciseCursorPosition
                    ]?.toLowerCase() === "v"
                  }
                  letter="V"
                  color={
                    isTutorActiveCurrently
                      ? KEY_FINGER_COLORS.INDEX_LEFT_HAND
                      : ""
                  }
                />
                <Key
                  isHighlighted={
                    selectedLessonText?.[
                      exerciseCursorPosition
                    ]?.toLowerCase() === "b"
                  }
                  letter="B"
                  color={
                    isTutorActiveCurrently
                      ? KEY_FINGER_COLORS.INDEX_LEFT_HAND
                      : ""
                  }
                />
                <Key
                  isHighlighted={
                    selectedLessonText?.[
                      exerciseCursorPosition
                    ]?.toLowerCase() === "n"
                  }
                  letter="N"
                  color={
                    isTutorActiveCurrently
                      ? KEY_FINGER_COLORS.INDEX_RIGHT_HAND
                      : ""
                  }
                />
                <Key
                  isHighlighted={
                    selectedLessonText?.[
                      exerciseCursorPosition
                    ]?.toLowerCase() === "m"
                  }
                  letter="M"
                  color={
                    isTutorActiveCurrently
                      ? KEY_FINGER_COLORS.INDEX_RIGHT_HAND
                      : ""
                  }
                />
                <Key
                  isHighlighted={[",", ";"].some(
                    (char) =>
                      selectedLessonText?.[exerciseCursorPosition] === char
                  )}
                  color={
                    isTutorActiveCurrently
                      ? KEY_FINGER_COLORS.MIDDLE_FINGER
                      : ""
                  }
                  letter={
                    <div
                      style={{
                        lineHeight: 0.65,
                        fontSize: "0.85rem",
                        textAlign: "left",
                        paddingLeft: 6
                      }}
                    >
                      ;<br /> ,
                    </div>
                  }
                />
                <Key
                  isHighlighted={[".", ":"].some(
                    (char) =>
                      selectedLessonText?.[exerciseCursorPosition] === char
                  )}
                  color={
                    isTutorActiveCurrently ? KEY_FINGER_COLORS.RING_FINGER : ""
                  }
                  letter={
                    <div
                      style={{
                        lineHeight: 0.65,
                        fontSize: "0.85rem",
                        textAlign: "left",
                        paddingLeft: 6
                      }}
                    >
                      :<br /> .
                    </div>
                  }
                />
                <Key
                  isHighlighted={["-", "_"].some(
                    (char) =>
                      selectedLessonText?.[exerciseCursorPosition] === char
                  )}
                  color={isTutorActiveCurrently ? KEY_FINGER_COLORS.PINKY : ""}
                  letter={
                    <div
                      style={{
                        lineHeight: 1.2,
                        fontSize: "0.9rem",
                        textAlign: "left",
                        paddingLeft: 6,
                        marginTop: -8
                      }}
                    >
                      _<br /> -
                    </div>
                  }
                />
                <Key
                  isHighlighted={
                    selectedLessonText?.[exerciseCursorPosition] === ">"
                  }
                  color={isTutorActiveCurrently ? KEY_FINGER_COLORS.PINKY : ""}
                  style={{
                    width: 93,
                    fontSize: "0.9rem",
                    textAlign: "left",
                    padding: 4
                  }}
                  letter="&#8679;"
                />
              </div>

              <div style={{ display: "flex", gap: 4 }}>
                <Key
                  style={{
                    width: 52,
                    fontSize: "0.8rem",
                    textAlign: "left",
                    padding: 4,
                    paddingTop: 6
                  }}
                  letter="Ctrl"
                />
                <Key
                  style={{
                    width: 52
                  }}
                />
                <Key
                  style={{
                    width: 52,
                    textAlign: "left",
                    fontSize: "0.8rem",
                    padding: 4,
                    paddingTop: 6
                  }}
                  letter="Alt"
                />
                <Key
                  style={{ width: 159 }}
                  isHighlighted={
                    selectedLessonText?.[exerciseCursorPosition] === " "
                  }
                  color={isTutorActiveCurrently ? "#ffc0c0" : ""}
                />
                <Key
                  style={{
                    width: 48,
                    textAlign: "left",
                    fontSize: "0.75rem",
                    padding: 4,
                    paddingTop: 6
                  }}
                  letter="AltGr"
                />
                <Key style={{ width: 48 }} />
                <Key style={{ width: 48 }} />
                <Key
                  style={{
                    width: 52,
                    fontSize: "0.8rem",
                    textAlign: "left",
                    padding: 4,
                    paddingTop: 6
                  }}
                  letter="Ctrl"
                />
              </div>
            </div>
          </div>
          <InfoPanel state={state} />
        </div>
      </div>
    </div>
  );
}

export default Index;
