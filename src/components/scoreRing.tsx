import { StyleSheet, Text, View } from "react-native";
import Svg, { Circle } from "react-native-svg";
import { COLORS } from "@/lib/constants";

export default function ScoreRing({ score }: { score: number }) {
    const size = 82;
    const strokeWidth = 8;
    const radius = (size - strokeWidth) / 2;
    const circumference = 2 * Math.PI * radius;
    const progress = Math.max(0, Math.min(100, score));

    return (
        <View style={styles.scoreRing}>
            <Svg width={size} height={size} style={StyleSheet.absoluteFill}>
                <Circle
                    cx={size / 2}
                    cy={size / 2}
                    r={radius}
                    fill="none"
                    stroke="#E7EDF2"
                    strokeWidth={strokeWidth}
                />
                <Circle
                    cx={size / 2}
                    cy={size / 2}
                    r={radius}
                    fill="none"
                    stroke="#5C5CFF"
                    strokeWidth={strokeWidth}
                    strokeDasharray={`${circumference} ${circumference}`}
                    strokeDashoffset={circumference * (1 - progress / 100)}
                    strokeLinecap="butt"
                    rotation="-90"
                    origin={`${size / 2}, ${size / 2}`}
                />
            </Svg>
            <Text style={styles.scoreNumber}>{Math.round(progress)}</Text>
        </View>
    );
}

const styles = StyleSheet.create({
    scoreRing: { width: 82, height: 82, alignItems: "center", justifyContent: "center" },
    scoreNumber: { color: COLORS.ink, fontSize: 23, fontWeight: "800" },
})