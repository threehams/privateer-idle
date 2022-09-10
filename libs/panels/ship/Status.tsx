import { useSelector } from "../../store/StateProvider";

type Props = {
  className?: string;
};
export const Status = ({ className }: Props) => {
  const timer = useSelector((state) => state.timers.ship);
  const currentAction = useSelector((state) => state.currentShipAction);

  return (
    <div className={className}>
      You are {currentAction.type} ({timer}).
    </div>
  );
};
