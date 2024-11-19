import style from './FeatureCard.module.scss'

type FeatureCardProps = {
    title: string,
    description: string,
    image?: string
}

const FeatureCard = ({title, description, image}: FeatureCardProps) => {
    return (
        <section className={style.featureCardSection}>
            <div className={style.wrapperSection}>
                <h1 className={style.title}>
                    {title}
                </h1>
                <p className={style.description}>
                    {description}
                </p>
                {image && <img className={style.image} src={image} alt="Description of the feature"/>}
            </div>
        </section>
    )
};

export default FeatureCard;