import { Button } from "../components/ui/button";
import NavBar from "../components/NavBar";
import { MultiStepLoaderDemo } from "../components/MultiStepLoaderDemo";

const HomePage = () => {
  return (
    <div className="h-screen w-full flex flex-col dark:bg-black bg-white justify-center items-center">
      <div>
        {" "}
        <MultiStepLoaderDemo />
      </div>
    </div>
  );
};

export default HomePage;
