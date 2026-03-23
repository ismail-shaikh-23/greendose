import MDEditor from "@uiw/react-md-editor";
import { Controller } from "react-hook-form";
import styles from "./Markdown.module.scss";
import withLabelAndError from "../withLabelAndError";
import { commands } from "@uiw/react-md-editor";

const excludeCommands = [
  "quote",
  "edit",
  "preview",
  "code",
  "codeBlock",
  "fullscreen",
  "help",
  "comment",
  "checked-list"
];

const Markdown = (props) => {
  const { control, register, name, validations, ...rest } = props;

  const filterCommands = (command) => {
    return !excludeCommands.includes(command?.name) && command;
  };
  const renderMarkdown = (field = {}) => (
    <div data-color-mode="light">
      <MDEditor
        {...field}
        {...rest}
        commandsFilter={filterCommands}
        value={field.value || ""}
        className={styles.inputField}
        onChange={(val) => field.onChange(val || "")}
        height={200}
      />
    </div>
  );
  if (control) {
    return (
      <Controller
        control={control}
        rules={validations}
        name={name}
        render={({ field }) => renderMarkdown(field)}
      />
    );
  } else {
    const field = register && register(name, validations);
    return renderMarkdown(field);
  }
};
const MarkdownWitbLabelAndError = withLabelAndError(Markdown);

export default MarkdownWitbLabelAndError;
export { Markdown };
