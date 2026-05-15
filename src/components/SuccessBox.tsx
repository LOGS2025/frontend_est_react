import styles from './SuccessBox.module.css'

type ProbabilityResult = {
  result: number;
  distribution: string;
  condition: string;
};

export const SuccessBox = ({probData}:{probData : ProbabilityResult})=>{
    return (
        <div className="container">
            <div className="flex flex-col flex-wrap items-center gap-2 ml-2 mr-2">
                <h1 className="text-blue-500 font-medium">Resultado del Cálculo</h1>
                <span className={styles.res}>{(probData.result * 100).toFixed(4)}%</span>
                <span className="text-blue-400">Distribución:</span>
                <span className={styles.res}>{probData.distribution}</span>
                <span className="text-blue-400">Condición:</span>
                <span className={styles.res}>{probData.condition}</span>
            </div>
        </div>
    )
}