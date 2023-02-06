import { useReducer, useState, useEffect } from "react";
import "./App.css";

type Video = {
  audio: boolean;
  noWifi: boolean;
};

type Model = {
  emailNotifications: boolean;
  useLocation: boolean;
  videoCtrls: {
    selected: boolean;
    ctrls: Video;
  };
};

type VideoCtrl = {
  type: "VideoCtrl";
  payload: {
    selected: boolean;
    audio: boolean;
    noWifi: boolean;
  };
};

type EmailNotification = {
  type: "EmailNotification";
};

type UseLocation = {
  type: "UseLocation";
};

type Msg = EmailNotification | UseLocation | VideoCtrl;

type Dispatch = (msg: Msg) => void;

type Ui = Model & {
  dispatch: Dispatch;
  doPost: React.Dispatch<React.SetStateAction<Model>>;
};

type OnEvtHandler<T> = T;
type CheckboxInput = {
  id: string;
  isChecked: boolean;
  onEventHandler: OnEvtHandler<() => void>;
};

// ------------------------------
//

function Checkbox({
  id,
  isChecked,
  onEventHandler,
}: CheckboxInput): JSX.Element {
  return (
    <input
      id={id}
      type="checkbox"
      checked={isChecked}
      onChange={onEventHandler}
    />
  );
}

function Form({
  emailNotifications,
  useLocation,
  videoCtrls,
  dispatch,
  doPost,
}: Ui): JSX.Element {
  return (
    <form
      onSubmit={(evt) => {
        evt.preventDefault();
        const data: Model = {
          emailNotifications,
          useLocation,
          videoCtrls,
        };
        doPost(data);
      }}
    >
      <ul>
        <li>
          <label htmlFor="email">Email notifications</label>
          <Checkbox
            {...{
              id: "email",
              isChecked: emailNotifications,
              onEventHandler: () => {
                dispatch({ type: "EmailNotification" });
              },
            }}
          />
        </li>
        <li>
          <label htmlFor="video">video autoplay</label>
          <Checkbox
            {...{
              id: "video",
              isChecked: videoCtrls.selected,
              onEventHandler: () => {
                dispatch({
                  type: "VideoCtrl",
                  payload: {
                    selected: !videoCtrls.selected,
                    audio: videoCtrls.ctrls.audio,
                    noWifi: videoCtrls.ctrls.noWifi,
                  },
                });
              },
            }}
          />
          {videoCtrls.selected && (
            <ul>
              <li>
                <label htmlFor="audio">Audio </label>
                <Checkbox
                  {...{
                    id: "audio",
                    isChecked: videoCtrls.ctrls.audio,
                    onEventHandler: () => {
                      dispatch({
                        type: "VideoCtrl",
                        payload: {
                          selected: videoCtrls.selected,
                          audio: !videoCtrls.ctrls.audio,
                          noWifi: videoCtrls.ctrls.noWifi,
                        },
                      });
                    },
                  }}
                />
              </li>

              <li>
                <label htmlFor="wifi">With out wifi </label>
                <Checkbox
                  {...{
                    id: "wifi",
                    isChecked: videoCtrls.ctrls.noWifi,
                    onEventHandler: () => {
                      dispatch({
                        type: "VideoCtrl",
                        payload: {
                          selected: videoCtrls.selected,
                          audio: videoCtrls.ctrls.audio,
                          noWifi: !videoCtrls.ctrls.noWifi,
                        },
                      });
                    },
                  }}
                />
              </li>
            </ul>
          )}
        </li>
        <li>
          <label htmlFor="location">Use location</label>
          <Checkbox
            {...{
              id: "location",
              isChecked: useLocation,
              onEventHandler: () => {
                dispatch({ type: "UseLocation" });
              },
            }}
          />
        </li>
      </ul>
      <input type="submit" value="submit" readOnly />
    </form>
  );
}

function getInitalObject(): Model {
  return {
    emailNotifications: false,
    useLocation: false,
    videoCtrls: {
      selected: false,
      ctrls: {
        audio: false,
        noWifi: false,
      },
    },
  };
}

function OptionsReducer(state: Model, msg: Msg): Model {
  switch (msg.type) {
    case "EmailNotification":
      return {
        ...state,
        emailNotifications: !state.emailNotifications,
      };
    case "UseLocation":
      return {
        ...state,
        useLocation: !state.useLocation,
      };
    case "VideoCtrl":
      return {
        ...state,
        videoCtrls: {
          selected: msg.payload.selected,
          ctrls: {
            noWifi: msg.payload.noWifi,
            audio: msg.payload.audio,
          },
        },
      };
  }
}

function App() {
  const [state, dispatch] = useReducer(OptionsReducer, getInitalObject());
  const [data, setData] = useState<Model>(getInitalObject());

  const POST_URL = "https://dummyjson.com/http/200";

  useEffect(() => {
    //
    const postData = async () => {
      try {
        const post = await fetch(POST_URL, {
          method: "POST",
          body: JSON.stringify(data),
        });
        const response = await post.json();
        console.info(response);
      } catch (e: any) {
        console.warn(e.message || "");
      }
    };

    postData();
  }, [data]);

  return (
    <div className="App">
      <Form {...{ ...state, dispatch, doPost: setData }} />
    </div>
  );
}

export default App;
