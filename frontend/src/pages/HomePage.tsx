import { useRecoilValue } from "recoil";
import SideBar from "../components/SideBar";
import { isOpenState } from "../atoms/todoAtom";
import TodoBlock from "../components/TodoBlock";
import GoalBlock from "../components/GoalBlock";

const HomePage = () => {
  const isOpen = useRecoilValue(isOpenState);

  console.log("home render");

  return (
    <div>
      <div className=" flex">
        <SideBar />
        {isOpen === "TodoBlock" && <TodoBlock />}
        {isOpen === "GoalBlock" && <GoalBlock />}
      </div>
    </div>
  );
};
export default HomePage;
