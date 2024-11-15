import { Icon } from "@iconify/react";

type InputProps = {
  value: string;
  setValue: React.Dispatch<React.SetStateAction<string>>;
  className?: string;
  icon?: string;
  iconPosition?: "left" | "right"
  iconAction?: Function;
}

export default function CustomInput(props: InputProps) {
  const { value, setValue, icon, iconPosition = "right", className: styles, iconAction } = props;
  return (
    <div className="relative">
      {icon && <div className={`absolute inset-y-0 flex items-center ${iconPosition === "right" ? "pe-3 end-0" : "ps-3 start-0"} ${iconAction ? "cursor-pointer" : "pointer-events-none"} `}>
        <Icon icon={icon} onClick={iconAction ? () => iconAction() : () => { }} />
      </div>}
      <input className={`block w-full p-2 ${iconPosition === "left" ? "ps-8" : ""} text-sm text-gray-900 border border-[#EDEDED] bg-gray-50 focus:ring-0 focus:outline-none
        dark:placeholder-gray-800 ${styles}`}
        placeholder="Select Product"
        required
        value={value}
        onChange={e => setValue(e.target.value)}
      />
    </div>
  )
}
