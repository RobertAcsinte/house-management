import style from './FeatureCard.module.scss'

type FeatureCardProps = {
    title: string,
    description: string,
    image?: string
}

const FeatureCard = ({title, description, image}: FeatureCardProps) => {
    return (
        <div className={style.container}>
            <div className={style.wrapper}>
                <h1>
                    {title}
                </h1>
                <h2>
                    {description}
                </h2>
                {image && <img className={style.image} src={image} alt="Description of the feature"/>}
            </div>
        </div>
    )
};

export default FeatureCard;