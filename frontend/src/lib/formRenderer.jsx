import FormControl from "@/components/FormControl/FormControl";

export default function formRenderer(formConfig, formState, register, control) {
  return Object.entries(formConfig || {}).map(([name, obj]) => {
    if (obj?.hide) return;
    return (
      <FormControl
        key={name}
        name={name}
        controlType={obj.controlType}
        label={obj.label}
        placeholder={obj.placeholder || `Enter ${obj.label}`}
        validations={obj.validations}
        errorMessage={formState?.errors?.[name]?.message}
        isRequired={obj.isRequired}
        autoComplete={obj.autoComplete || "new-password"}
        {...(obj.isControlled && control ? { control } : { register })}
        {...(obj.props || {})}
      />
    );
  });
}
