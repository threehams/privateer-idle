import { useSelector } from "./StateProvider";

type Props = {
  className?: string;
};
export const Status = ({ className }: Props) => {
  const count = useSelector((state) => state.count);
  const autoIncrement = useSelector((state) => state.autoIncrement);

  return (
    <div className={className}>
      You have {count} thing{count === 1 ? "" : "s"}.{" "}
      {!!autoIncrement && (
        <>
          Making {autoIncrement} thing
          {autoIncrement === 1 ? "" : "s"} per second
        </>
      )}
    </div>
  );
};
