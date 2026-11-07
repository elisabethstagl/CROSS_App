import Svg, { G, Path, Ellipse } from "react-native-svg";
import { useTheme } from "@/hooks/use-theme";

type Props = {
  size?: number;
};

const toes = [
  [-6.2, -16.1, 2.6, 3.6],
  [-1.1, -18.7, 2.8, 3.9],
  [4.5, -18.2, 2.6, 3.6],
  [9, -15.3, 2.2, 3],
  [11.8, -11.3, 1.8, 2.5],
];

function Foot({ transform }: { transform: string }) {
  return (
    <G transform={transform}>
      <Path d="M-6.7 0.8C-7.7-5.8-4.7-11.2 0.1-11.5c4.8-.3 7.7 4.5 7.1 10.7-.5 5.2-2.8 11.4-7.2 11.5-4.7.1-6-4.6-6.7-9.9Z" />
      {toes.map(([cx, cy, rx, ry], index) => (
        <Ellipse key={index} cx={cx} cy={cy} rx={rx} ry={ry} />
      ))}
    </G>
  );
}

export default function FootprintsLogo({ size = 28 }: Props) {
  const colors = useTheme();

  return (
    <Svg width={size} height={size} viewBox="0 0 64 64" fill={colors.primary}>
      <Foot transform="translate(18 37) rotate(-22)" />
      <Foot transform="translate(43 27) rotate(20)" />
    </Svg>
  );
}
