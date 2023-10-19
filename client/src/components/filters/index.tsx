import Colors from "@/components/filters/colors";
import Standing from "@/components/filters/standing";

type TComponentMap = {
  [key: string]: React.FC;
};

export const componentMap: TComponentMap = {
  colors: Colors,
  standing: Standing,
};
