interface IconProps {
    name: string;              // Name of the icon file (without `.svg`)
    alt?: string;              // Optional alt text
    className?: string;        // Optional CSS class
    width?: string;            // Optional width
    height?: string;           // Optional height
}

const Icon = ({ name, alt = "", className = "", width = "24px", height = "24px"}: IconProps) => {
    return (
        <img
            src={`/icons/${name}.svg`}
            alt={alt || name}
            className={className}
            style={{width:width, height: height}}
        />
    );
};

export default Icon;