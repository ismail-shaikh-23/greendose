import React, { memo } from "react";
import Input from "./Input/Input";
import Password from "./Password/Password";
import Select from "./Select/Select";
import FileInput from "./FileInput/FileInput";
import Checkbox from "./Checkbox/Checkbox";
import FieldArray from "./FieldArray/FieldArray";
import Range from "./Range/Range";
import TextArea from "./TextArea/TextArea";
import Markdown from "./MarkdownEditor/Markdown";

const FormControl = ({ controlType, ...rest }) => {
  switch (controlType) {
    case "input":
      return <Input {...rest} />;
    case "password":
      return <Password {...rest} />;
    case "textarea":
      return <TextArea {...rest} controlType={controlType} />;
    case "select":
      return <Select {...rest} />;
    case "file":
      return <FileInput {...rest} />;
    case "checkbox":
      return <Checkbox {...rest} controlType={controlType} />;
    case "fieldArray":
      return <FieldArray {...rest} />;
    case "range":
      return <Range {...rest} />;
    case "markdown":
      return <Markdown {...rest}/>
    default:
      return null;
  }
};

export default memo(FormControl);
