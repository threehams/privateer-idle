import { useSelector } from "../../store/StateProvider";

type Props = {
  className?: string;
};
export const Status = ({ className }: Props) => {
  const timer = useSelector((state) => state.timers.ship);
  const currentAction = useSelector((state) => state.currentShipAction);
  const player = useSelector((state) => state.player);

  return (
    <div className={className}>
      <div>You have {player.credits} credits.</div>
      <div>
        You are {currentAction.type} ({timer})
        {currentAction.type === "traveling" && (
          <span>to {currentAction.destination.id}</span>
        )}
        .
      </div>
    </div>
  );
};
