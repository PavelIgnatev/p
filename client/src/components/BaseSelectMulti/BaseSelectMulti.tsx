import Select from "react-select";
import { BaseSelectModel } from "./types";
import classes from "./BaseSelectMulti.module.scss";

const getComputedColor = (varName: string, fallback: string) => {
  if (typeof document !== 'undefined') {
    return getComputedStyle(document.documentElement).getPropertyValue(varName).trim() || fallback;
  }
  return fallback;
};

const multiSelectStyles = {
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
    boxShadow: state.isFocused ? `0 0 0 1px ${getComputedColor('--primary-color', '#4A72FF')}` : "none",
    background: getComputedColor('--background-main', '#FFFFFF'),
    cursor: "pointer",
    height: "100%",
    transition: 'all 0.2s ease',
    "&:hover": {
      border: `1px solid ${getComputedColor('--primary-color', '#4A72FF')} !important`,
    }
  }),
  container: (provided: any, state: any) => ({
    ...provided,
    transition: "200ms ease-out all",
    boxShadow: "none",
    borderRadius: "8px",
  }),
  multiValue: (provided: object) => ({
    ...provided,
    backgroundColor: getComputedColor('--primary-color', '#4A72FF'),
    borderRadius: "6px",
  }),
  multiValueLabel: (provided: object) => ({
    ...provided,
    color: '#FFFFFF',
    fontSize: '0.85em',
    fontWeight: '500',
  }),
  multiValueRemove: (provided: object) => ({
    ...provided,
    color: '#FFFFFF',
    "&:hover": {
      backgroundColor: getComputedColor('--primary-hover', '#3157de'),
      color: '#FFFFFF',
    }
  }),
  dropdownIndicator: (provided: object, state: any) => ({
    ...provided,
    color: `${getComputedColor('--primary-color', '#4A72FF')} !important`,
    paddingLeft: 0,
  }),
  input: (provided: object, state: any) => ({
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

export const BaseSelectMulti = (props: BaseSelectModel) => {
  const { options, onChange, className, placeholder, children, value } = props;

  return (
    <div className={classes.wrapper}>
      <label htmlFor={placeholder} className={classes.label}>
        {children}
      </label>
      <Select
        id={placeholder}
        className={className}
        isMulti
        isClearable={true}
        options={options}
        onChange={onChange}
        hideSelectedOptions={false}
        closeMenuOnSelect={false}
        controlShouldRenderValue={false}
        placeholder={placeholder}
        value={value}
        styles={multiSelectStyles}
      />
    </div>
  );
};
