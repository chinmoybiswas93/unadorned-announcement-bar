import domReady from "@wordpress/dom-ready";
import { createRoot, useState, useEffect } from "@wordpress/element";
import { __ } from "@wordpress/i18n";
import apiFetch from "@wordpress/api-fetch";
import {
  Button,
  FontSizePicker,
  Panel,
  PanelBody,
  PanelRow,
  TextareaControl,
  ToggleControl,
} from "@wordpress/components";

import {
  // eslint-disable-next-line @wordpress/no-unsafe-wp-apis
  __experimentalHeading as Heading,
} from "@wordpress/components";

//Managing the state of the controls
const useSettings = () => {
  const [message, setMessage] = useState(null);
  const [display, setDisplay] = useState(null);
  const [size, setSize] = useState(null);

  //Loading the settings
  useEffect(() => {
    console.log("Settings Loaded");
    apiFetch({ path: "/wp/v2/settings" }).then((settings) => {
      console.log(settings);
      setMessage(settings.unadorned_announcement_bar.message);
      setDisplay(settings.unadorned_announcement_bar.display);
      setSize(settings.unadorned_announcement_bar.size);
    });
  }, []);

  //Saving the settings
  const saveSettings = () => {
    console.log("Settings Updaing");
    apiFetch({
      path: "/wp/v2/settings",
      method: "POST",
      data: {
        unadorned_announcement_bar: {
          message,
          display,
          size,
        },
      },
    }).then(() => {
      console.log("Settings Updated");
    });
  };

  return {
    message,
    setMessage,
    display,
    setDisplay,
    size,
    setSize,
    saveSettings,
  };
};

//Allowing loger text for the announcement message
const MessageControl = ({ value, onChange }) => {
  return (
    <TextareaControl
      label={__("Message", "unadorned-announcement-bar")}
      value={value}
      onChange={onChange}
      __nextHasNoMarginBottom
    />
  );
};

//toggle the visibility of the announcement bar
const DisplayControl = ({ value, onChange }) => {
  //   console.log(value);
  return (
    <ToggleControl
      label={__("Display", "unadorned-announcement-bar")}
      checked={value}
      onChange={onChange}
      __nextHasNoMarginBottom
    />
  );
};

//The size control
const SizeControl = ({ value, onChange }) => {
  return (
    <FontSizePicker
      fontSizes={[
        { name: "Small", size: "small", slug: "small" },
        { name: "Medium", size: "medium", slug: "medium" },
        { name: "Large", size: "large", slug: "large" },
        { name: "XL", size: "xl", slug: "xl" },
      ]}
      value={value}
      onChange={onChange}
      __nextHasNoMarginBottom
      disableCustomFontSizes={true}
    />
  );
};

//The save button
const SaveButton = ({ onClick }) => {
  return (
    <Button variant="primary" onClick={onClick} __next40pxDefaultSize>
      {__("Save", "unadorned-announcement-bar")}
    </Button>
  );
};

//The experimental heading settings title
const SettingsTitle = () => {
  return (
    <Heading level={1}>
      {__("Announcement Bar Settings", "unadorned-announcement-bar")}
    </Heading>
  );
};

//Building the UI of the settings page
const SettingsPage = () => {
  // Accessing the state variables and setter functions in the SettingsPage component
  const {
    message,
    setMessage,
    display,
    setDisplay,
    size,
    setSize,
    saveSettings,
  } = useSettings();

  //   console.log(message, display, size);

  return (
    <>
      <SettingsTitle />
      <Panel>
        <PanelBody
          title={__("Settingss", "unadorned-announcement-bar")}
          initialOpen={true}
        >
          <PanelRow>
            <MessageControl
              value={message}
              onChange={(value) => setMessage(value)}
            />
          </PanelRow>
          <PanelRow>
            <DisplayControl
              value={display}
              onChange={(value) => setDisplay(value)}
            />
          </PanelRow>
        </PanelBody>
        <PanelBody
          title={__("Appearance", "unadorned-announcement-bar")}
          initialOpen={false}
        >
          <PanelRow>
            <SizeControl value={size} onChange={(value) => setSize(value)} />
          </PanelRow>
        </PanelBody>
      </Panel>
      <div>
        <SaveButton onClick={saveSettings} />
      </div>
    </>
  );
};

//Kick-starting the React settings page
domReady(() => {
  const root = createRoot(
    document.getElementById("unadorned-announcement-bar-settings")
  );

  root.render(<SettingsPage />);
});
