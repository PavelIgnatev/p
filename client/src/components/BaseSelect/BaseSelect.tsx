import Select from "react-select";
import { BaseSelectModel } from "./types";

const getComputedColor = (varName: string, fallback: string) => {
  if (typeof document !== 'undefined') {
    return getComputedStyle(document.documentElement).getPropertyValue(varName).trim() || fallback;
  }
  return fallback;
};

export const specialSelectStyles = {
  option: (provided: object, state: any) => ({
    ...provided,
    color: state.isSelected ? "#FFFFFF" : getComputedColor('--primary-color', '#4A72FF'),
    cursor: "pointer",
    backgroundColor: state.isSelected 
      ? getComputedColor('--primary-color', '#4A72FF')
      : state.isFocused 
        ? `${getComputedColor('--primary-color', '#4A72FF')}1A`
        : getComputedColor('--background-main', '#FFFFFF'),
    transition: 'all 0.2s ease',
  }),
  indicatorSeparator: () => ({
    display: "none",
  }),
  control: (provided: object, state: any) => ({
    ...provided,
    border: `1px solid ${getComputedColor('--border-color', '#e0e0e0')} !important`,
    borderRadius: "8px",
    boxShadow: "none !important",
    background: getComputedColor('--background-main', '#FFFFFF'),
    cursor: "pointer",
    height: "100%",
    transition: 'all 0.2s ease',
    "&:hover": {
      border: `1px solid ${getComputedColor('--primary-color', '#4A72FF')} !important`,
    }
  }),
  container: (provided: any) => ({
    ...provided,
    borderRadius: "8px",
  }),
  singleValue: (provided: object) => ({
    ...provided,
    color: getComputedColor('--text-color', '#333333'),
  }),
  dropdownIndicator: (provided: object) => ({
    ...provided,
    color: `${getComputedColor('--primary-color', '#4A72FF')} !important`,
    paddingLeft: 0,
    "&:hover": {
      color: `${getComputedColor('--primary-hover', '#3157de')} !important`,
    }
  }),
  input: (provided: object) => ({
    ...provided,
    color: getComputedColor('--text-color', '#333333'),
  }),
  valueContainer: (provided: object) => ({
    ...provided,
    paddingRight: 0,
  }),
  placeholder: (provided: object) => ({
    ...provided,
    color: getComputedColor('--text-secondary', '#666666'),
  }),
  menu: (provided: object) => ({
    ...provided,
    backgroundColor: getComputedColor('--background-main', '#FFFFFF'),
    border: `1px solid ${getComputedColor('--border-color', '#e0e0e0')}`,
    boxShadow: "none",
    marginTop: "4px",
  }),
};

export const BaseSelect = (props: BaseSelectModel) => {
  const { options, onChange, className, placeholder, disabled, defaultValue, value } = props;

  return (
    <Select
      value={value}
      className={className}
      isClearable={true}
      options={options}
      onChange={onChange}
      placeholder={placeholder}
      isDisabled={disabled}
      defaultValue={defaultValue}
      id={className}
      styles={specialSelectStyles}
    />
  );
};
