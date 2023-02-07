import { useState, useEffect } from "react";
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

type DataPost = {
  isPost: boolean;
  state: Model;
};
//
type ReactDispatch<T> = React.Dispatch<React.SetStateAction<T>>;
type Ui = Model & {
  dispatch: ReactDispatch<Model>;
  doPost: ReactDispatch<DataPost>;
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
      className="user-options"
      onSubmit={(evt) => {
        evt.preventDefault();
        const post: DataPost = {
          isPost: true,
          state: {
            emailNotifications,
            useLocation,
            videoCtrls,
          },
        };
        doPost(post);
      }}
    >
      <ul className="option-group mb-10">
        <li>
          <label htmlFor="email">Email notifications</label>
          <Checkbox
            {...{
              id: "email",
              isChecked: emailNotifications,
              onEventHandler: () => {
                dispatch((prevState) => ({
                  ...prevState,
                  emailNotifications: !emailNotifications,
                }));
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
                dispatch((prevState) => ({
                  ...prevState,
                  videoCtrls: {
                    ...videoCtrls,
                    selected: !videoCtrls.selected,
                  },
                }));
              },
            }}
          />
        </li>
        {/* subgroup */}
        {videoCtrls.selected && (
          <li>
            <ul className="option-group option-subgroup">
              <li>
                <label htmlFor="audio">Audio </label>
                <Checkbox
                  {...{
                    id: "audio",
                    isChecked: videoCtrls.ctrls.audio,
                    onEventHandler: () => {
                      dispatch((prevState) => ({
                        ...prevState,
                        videoCtrls: {
                          ...videoCtrls,
                          ctrls: {
                            ...videoCtrls.ctrls,
                            audio: !videoCtrls.ctrls.audio,
                          },
                        },
                      }));
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
                      dispatch((prevState) => ({
                        ...prevState,
                        videoCtrls: {
                          ...videoCtrls,
                          ctrls: {
                            ...videoCtrls.ctrls,
                            noWifi: !videoCtrls.ctrls.noWifi,
                          },
                        },
                      }));
                    },
                  }}
                />
              </li>
            </ul>
          </li>
        )}
        {/* end subgroup */}
        <li>
          <label htmlFor="location">Use location</label>
          <Checkbox
            {...{
              id: "location",
              isChecked: useLocation,
              onEventHandler: () => {
                dispatch((prevState) => ({
                  ...prevState,
                  useLocation: !useLocation,
                }));
              },
            }}
          />
        </li>
      </ul>
      <input type="submit" value="submit" readOnly />
    </form>
  );
}

function getInitialState(): Model {
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

function App() {
  const [state, setState] = useState<Model>(getInitialState());
  const [data, setData] = useState<DataPost>({
    isPost: false,
    state: getInitialState(),
  });

  const POST_URL = "https://dummyjson.com/http/200";

  useEffect(() => {
    //
    const postData = async () => {
      try {
        const post = await fetch(POST_URL, {
          method: "POST",
          body: JSON.stringify(data.state),
        });
        const response = await post.json();
        console.info(response);
      } catch (e: any) {
        console.warn(e.message || "");
      }
    };

    if (data.isPost) postData();
  }, [data]);

  return (
    <div className="App">
      <h2 className="title">Select your options</h2>
      <Form {...{ ...state, dispatch: setState, doPost: setData }} />
    </div>
  );
}

export default App;
