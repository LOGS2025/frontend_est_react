import { Dispatch, SetStateAction, useEffect, useRef } from "react";
import styles from './FormProb.module.css'

export const ProbForm = ({
  test, set_prob_type, prob_type 
} : {
  test: string; 
  set_prob_type: Dispatch<SetStateAction<{
    critical_value: string;
    tail: string;
    hypothesis: string;
  }>>; 
  prob_type: {
    critical_value: string;
    tail: string;
    hypothesis: string;
  };
})=>{

  const inputs_tail = useRef<HTMLSelectElement>(null);

  useEffect(() => {
    console.log('Data changed:', prob_type);
    // Process your data here
  }, [prob_type]); // ✅ Runs when formData changes
  
  const handleChange = (field: string, value: any) => {
    set_prob_type(prev => ({ ...prev, [field]: value }));
  };

  const select_tail = ()=>{
    return (
        <select className="max-w-8 ml-2 mr-4"
            onChange={(e)=>{handleChange('tail',inputs_tail.current?.value);}}
            required ref={inputs_tail}
            name="select_prob" 
        >
            <option value="X>x">&gt;</option>
            <option value="X<x">&lt;</option>
            <option value="X!=x">≠</option>
        </select>
    )
  }
  const select_crit_val = ()=>{
    return (
        <label className="sm:w-auto">
            <input className="max-w-20 placeholder:text-body"
              onChange={(e)=>{handleChange('critical_value',e.target.value)}}
              type="number" 
              placeholder="X"
            />
        </label>
    )
  }
  const select_hypothesis = ()=>{
    return (
        <input className="w-14" 
            onChange={(e)=>{handleChange('hypothesis',e.target.value)}}
            type="number" 
            placeholder="X"
        />
    )
  }
  
  const probability = (figures : string)=>{
    return (
        <form className="w-full overflow-x-auto mt-7 mb-7">
          <div className="flex flex-nowrap justify-center min-w-max text-center font-bold">
            <span>P&#40; X</span>

            {select_tail()}
            
            {select_crit_val()}

            <span>{figures}</span>

            {select_hypothesis()}
            <span>&#41;</span>
          </div>
        </form>
      )
  }
  switch (test) {
    case '2':
        return (
            probability("| μ =")
        )
    case '4':
        return (
            probability("| σ =")
        )
    case '1':
        return (
            probability("| μ1-μ2 =")
        )

    case '3':
        return (
            probability("| σ1/σ2 =")
        )
    default:
      break;
  }
}