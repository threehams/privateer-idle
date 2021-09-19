import { useSelector } from "./StateProvider";

export const Status = () => {
  const count = useSelector((state) => state.count);
  const autoIncrement = useSelector((state) => state.count);

  return (
    <div>
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
