import { Button } from "../components/ui/button";
import NavBar from "../components/NavBar";
import { MultiStepLoaderDemo } from "../components/MultiStepLoaderDemo";

const HomePage = () => {
  return (
    <div className="h-screen w-full flex flex-col dark:bg-black bg-white justify-center items-center">
      <h1 className="text-3xl font-bold underline mb-4">Hello world!</h1>
      <Button>fefef</Button>

      <div>
        {" "}
        <MultiStepLoaderDemo />
      </div>
    </div>
  );
};

export default HomePage;
