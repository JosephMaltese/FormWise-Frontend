import {ReactNode} from 'react';
import {
    Pressable,
    SafeAreaView,
    StyleSheet,
    Text,
    View,
} from 'react-native';
import {router} from 'expo-router';
import Svg, {Circle, Path} from 'react-native-svg';
import Body, {type ExtendedBodyPart} from 'react-native-body-highlighter';
import ScoreRing from "@/components/scoreRing";

const BRAND = '#5C5CFF';
const intensityColorsHex = ['#E5E5FF', '#C4C4FF', '#9696FF', BRAND];

// Replace this sample data with the muscles returned by your form analysis.
const frontData: ExtendedBodyPart[] = [
    {slug: 'quadriceps', intensity: 4},
    {slug: 'chest', intensity: 2},
];

function BrandMark() {
    return (
        <View style={styles.brandMark}>
            <Svg width={34} height={34} viewBox="0 0 34 34">
                <Path
                    d="M3 18h5l3-11 6 22 4-15 3 4h7"
                    fill="none"
                    stroke="#FFFFFF"
                    strokeWidth={2.5}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                />
            </Svg>
        </View>
    );
}

// function ScoreRing({score}: {score: number}) {
//     const size = 82;
//     const strokeWidth = 8;
//     const radius = (size - strokeWidth) / 2;
//     const circumference = 2 * Math.PI * radius;
//     const progress = Math.max(0, Math.min(100, score));
//
//     return (
//         <View style={styles.scoreRing}>
//             <Svg width={size} height={size} style={StyleSheet.absoluteFill}>
//                 <Circle
//                     cx={size / 2}
//                     cy={size / 2}
//                     r={radius}
//                     fill="none"
//                     stroke="#E7E7F2"
//                     strokeWidth={strokeWidth}
//                 />
//                 <Circle
//                     cx={size / 2}
//                     cy={size / 2}
//                     r={radius}
//                     fill="none"
//                     stroke={BRAND}
//                     strokeWidth={strokeWidth}
//                     strokeDasharray={`${circumference} ${circumference}`}
//                     strokeDashoffset={circumference * (1 - progress / 100)}
//                     strokeLinecap="round"
//                     rotation="-90"
//                     origin={`${size / 2}, ${size / 2}`}
//                 />
//             </Svg>
//             <Text style={styles.scoreNumber}>{Math.round(progress)}</Text>
//         </View>
//     );
// }

export default function LandingScreen(): ReactNode {
    return (
        <SafeAreaView style={styles.safeArea}>
            <View style={styles.content}>
                <View style={styles.brandRow}>
                    <BrandMark />
                    <Text style={styles.brandName}>FormWise</Text>
                </View>

                <View style={styles.previewCard}>
                    <View style={styles.previewColumn} pointerEvents="none">
                        <Body
                            data={frontData}
                            gender="male"
                            side="front"
                            scale={0.6}
                            border="none"
                            colors={intensityColorsHex}
                            defaultFill="#E8E8F4"
                        />
                    </View>

                    <View style={styles.analysisColumn}>
                        <View style={styles.analysisCard}>
                            <ScoreRing score={88} />
                            <View style={styles.analysisCopy}>
                                <View style={styles.badge}>
                                    <Text style={styles.badgeText}>FORM SCORE</Text>
                                </View>
                                <Text style={styles.analysisTitle}>Strong technique</Text>
                                <Text style={styles.analysisCaption}>Quads engaged</Text>
                            </View>
                        </View>
                    </View>
                </View>

                <View style={styles.heroCopy}>
                    <Text style={styles.heading}>Lift smarter. Move better.</Text>
                    <Text style={styles.subheading}>
                        Real-time form feedback and personalized insights help you train
                        with confidence and make every rep count.
                    </Text>
                </View>

                <View style={styles.actions}>
                    <Pressable
                        accessibilityRole="button"
                        onPress={() => router.push('/signup')}
                        style={({pressed}) => [styles.primaryButton, pressed && styles.pressed]}>
                        <Text style={styles.primaryButtonText}>Get Started</Text>
                    </Pressable>

                    <Pressable
                        accessibilityRole="button"
                        onPress={() => router.push('/login')}
                        style={({pressed}) => [styles.secondaryButton, pressed && styles.pressed]}>
                        <Text style={styles.secondaryButtonText}>Log In</Text>
                    </Pressable>
                </View>
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: '#FCFBFA',
    },
    content: {
        flex: 1,
        width: '100%',
        maxWidth: 560,
        alignSelf: 'center',
        paddingHorizontal: 24,
        paddingTop: 24,
        paddingBottom: 18,
    },
    brandRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 22,
    },
    brandMark: {
        width: 46,
        height: 46,
        borderRadius: 14,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: BRAND,
        marginRight: 11,
    },
    brandName: {
        color: '#17171B',
        fontSize: 32,
        fontWeight: '800',
        letterSpacing: -1.1,
    },
    previewCard: {
        height: 250,
        overflow: 'hidden',
        borderRadius: 32,
        backgroundColor: '#EEEEFF',
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 16,
    },
    previewColumn: {
        width: '42%',
        height: '100%',
        alignItems: 'center',
        justifyContent: 'center',
    },
    analysisColumn: {
        flex: 1,
        height: '100%',
        alignItems: 'flex-end',
        justifyContent: 'center',
    },
    analysisCard: {
        width: '100%',
        maxWidth: 250,
        paddingVertical: 15,
        paddingHorizontal: 13,
        borderRadius: 22,
        backgroundColor: '#FFFFFF',
        flexDirection: 'row',
        alignItems: 'center',
        shadowColor: '#292966',
        shadowOffset: {width: 0, height: 10},
        shadowOpacity: 0.1,
        shadowRadius: 20,
        elevation: 5,
    },
    scoreRing: {
        width: 82,
        height: 82,
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 10,
    },
    scoreNumber: {
        color: '#19191F',
        fontSize: 24,
        fontWeight: '800',
    },
    analysisCopy: {
        flex: 1,
        alignItems: 'flex-start',
        marginLeft: 10,
    },
    badge: {
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 999,
        backgroundColor: '#EEEEFF',
        marginBottom: 7,
    },
    badgeText: {
        color: BRAND,
        fontSize: 10,
        fontWeight: '800',
        letterSpacing: 0.4,
    },
    analysisTitle: {
        color: '#1D1D22',
        fontSize: 12,
        fontWeight: '800',
        marginBottom: 3,
    },
    analysisCaption: {
        color: '#686873',
        fontSize: 12,
    },
    heroCopy: {
        alignItems: 'center',
        paddingHorizontal: 10,
        marginTop: 24,
    },
    heading: {
        color: '#19191D',
        fontSize: 29,
        lineHeight: 34,
        fontWeight: '800',
        letterSpacing: -0.8,
        textAlign: 'center',
    },
    subheading: {
        maxWidth: 440,
        color: '#5F5F69',
        fontSize: 16,
        lineHeight: 23,
        textAlign: 'center',
        marginTop: 20,
    },
    actions: {
        marginTop: 'auto',
        gap: 10,
    },
    primaryButton: {
        minHeight: 56,
        borderRadius: 18,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: BRAND,
    },
    primaryButtonText: {
        color: '#FFFFFF',
        fontSize: 18,
        fontWeight: '700',
    },
    secondaryButton: {
        minHeight: 56,
        borderRadius: 18,
        borderWidth: 1.5,
        borderColor: '#DCDCE8',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#FFFFFF',
    },
    secondaryButtonText: {
        color: '#202025',
        fontSize: 18,
        fontWeight: '700',
    },
    pressed: {
        opacity: 0.78,
        transform: [{scale: 0.99}],
    },
});


