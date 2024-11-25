import { Input } from "@nextui-org/react";



interface IInput {
  label?: string;
  value: any;
  onChange: any;
  type?: string;
  startContent?: any;
  isClearable?: boolean;
  radius?: string;
  classNames?: {
    label: string,
    input: any;
    innerWrapper: string;
    inputWrapper: any;
  }
  placeholder?: string;
}

const DefaultInput = (props: IInput) => {

  const { label, value, onChange, type = "text", startContent, isClearable = true, radius = "lg", classNames, placeholder = "" } = props

  return (
    <Input
      label={label}
      value={value}
      onValueChange={onChange}
      isClearable
      radius="lg"
      classNames={{
        label: "text-black/50 dark:text-white/90",
        input: [
          "bg-transparent",
          "text-black/90 dark:text-white/90",
          "placeholder:text-default-700/50 dark:placeholder:text-white/60",
        ],
        innerWrapper: "bg-transparent",
        inputWrapper: [
          "shadow-xl",
          "bg-default-200/50",
          "dark:bg-default/60",
          "backdrop-blur-xl",
          "backdrop-saturate-200",
          "hover:bg-default-200/70",
          "dark:hover:bg-default/70",
          "group-data-[focus=true]:bg-default-200/50",
          "dark:group-data-[focus=true]:bg-default/60",
          "!cursor-text",
        ],
      }}
      placeholder={placeholder}
      startContent={
        startContent
      }
    />
  )
}


export default DefaultInput