import { useSelector } from "../../store/StateProvider";

type Props = {
  className?: string;
};
export const Status = ({ className }: Props) => {
  const currentTask = useSelector((state) => state.currentTask);

  return <div className={className}>You are {currentTask}.</div>;
};
