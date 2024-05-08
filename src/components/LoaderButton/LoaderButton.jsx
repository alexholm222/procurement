import './LoaderButton.scss';

const LoaderButton = ({color}) => {
    return (
        <div style={{borderColor: `${color}`}} class="loader"></div>
    )
};

export default LoaderButton;