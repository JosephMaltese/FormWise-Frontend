import {ReactNode, useState} from 'react';
import {
    ActivityIndicator,
    KeyboardAvoidingView,
    Platform,
    Pressable,
    StyleSheet,
    Text,
    TextInput,
    View,
} from 'react-native';
import {router} from 'expo-router';
import {SafeAreaProvider, SafeAreaView} from "react-native-safe-area-context";
import Svg, {Path} from 'react-native-svg';
import {useAuthSession} from '@/providers/AuthProvider';

const validator = require('validator');
const BRAND = '#5C5CFF';

function BackIcon() {
    return (
        <Svg width={25} height={25} viewBox="0 0 24 24">
            <Path
                d="M19 12H5m6-6-6 6 6 6"
                fill="none"
                stroke="#1D1D22"
                strokeWidth={2}
                strokeLinecap="round"
                strokeLinejoin="round"
            />
        </Svg>
    );
}

function EyeIcon({hidden}: {hidden: boolean}) {
    return (
        <Svg width={23} height={23} viewBox="0 0 24 24">
            <Path
                d={
                    hidden
                        ? 'M3 3l18 18M10.6 10.7a2 2 0 002.7 2.7M9.9 4.3A10.8 10.8 0 0112 4c5.5 0 9 6 9 6a16.8 16.8 0 01-2.1 2.8M6.6 6.6C4.3 8.1 3 10 3 10s3.5 6 9 6a9.8 9.8 0 004-.9'
                        : 'M2.5 12s3.5-6 9.5-6 9.5 6 9.5 6-3.5 6-9.5 6-9.5-6-9.5-6z M12 9a3 3 0 100 6 3 3 0 000-6z'
                }
                fill="none"
                stroke="#9898A3"
                strokeWidth={1.8}
                strokeLinecap="round"
                strokeLinejoin="round"
            />
        </Svg>
    );
}

export default function Login(): ReactNode {
    const {loginUser} = useAuthSession();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [passwordHidden, setPasswordHidden] = useState(true);
    const [emailTouched, setEmailTouched] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [loginError, setLoginError] = useState('');

    const emailIsValid = validator.isEmail(email.trim());
    const canSubmit = emailIsValid && password.length > 0 && !isSubmitting;

    const login = async (): Promise<void> => {
        setEmailTouched(true);
        if (!canSubmit) return;

        const normalizedEmail = validator.normalizeEmail(email.trim());
        if (!normalizedEmail) {
            setLoginError('Please enter a valid email address.');
            return;
        }

        setIsSubmitting(true);
        setLoginError('');

        try {
            const result = await loginUser(normalizedEmail, password);

            if (result.success) {
                router.replace('/(authorized)/(tabs)');
            } else {
                setLoginError('The email or password you entered is incorrect.');
            }
        } catch {
            setLoginError('Something went wrong. Please try again.');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <SafeAreaProvider>
        <SafeAreaView style={styles.safeArea} edges={['top', 'bottom']}>
            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : undefined}
                style={styles.flex}>
                <View style={styles.content}>
                    <View style={styles.topBar}>
                        <Pressable
                            accessibilityLabel="Go back"
                            accessibilityRole="button"
                            hitSlop={12}
                            onPress={() => router.back()}
                            style={({pressed}) => [styles.backButton, pressed && styles.pressed]}>
                            <BackIcon />
                        </Pressable>
                        <Text style={styles.brandName}>FormWise</Text>
                        <View style={styles.topBarSpacer} />
                    </View>

                    <View style={styles.loginPanel}>
                        <View style={styles.intro}>
                            <Text style={styles.title}>Welcome Back</Text>
                            <Text style={styles.subtitle}>
                                Log in to keep improving your form and tracking every workout.
                            </Text>
                        </View>

                        <View style={styles.form}>
                            <View style={styles.fieldGroup}>
                                <Text style={styles.label}>EMAIL ADDRESS</Text>
                                <View
                                    style={[
                                        styles.inputShell,
                                        emailTouched && !emailIsValid && styles.inputShellError,
                                    ]}>
                                    <TextInput
                                        value={email}
                                        onChangeText={value => {
                                            setEmail(value);
                                            setEmailTouched(true);
                                        }}
                                        placeholder="you@example.com"
                                        placeholderTextColor="#A1A1AA"
                                        autoCapitalize="none"
                                        autoCorrect={false}
                                        keyboardType="email-address"
                                        returnKeyType="next"
                                        textContentType="emailAddress"
                                        style={styles.input}
                                    />
                                </View>
                                {emailTouched && email.length > 0 && !emailIsValid ? (
                                    <Text style={styles.fieldError}>Enter a valid email address.</Text>
                                ) : null}
                            </View>

                            <View style={styles.fieldGroup}>
                                <Text style={styles.label}>PASSWORD</Text>
                                <View style={styles.inputShell}>
                                    <TextInput
                                        value={password}
                                        onChangeText={setPassword}
                                        placeholder="Your password"
                                        placeholderTextColor="#A1A1AA"
                                        autoCapitalize="none"
                                        autoCorrect={false}
                                        secureTextEntry={passwordHidden}
                                        returnKeyType="done"
                                        textContentType="password"
                                        onSubmitEditing={login}
                                        style={styles.input}
                                    />
                                    <Pressable
                                        accessibilityLabel={passwordHidden ? 'Show password' : 'Hide password'}
                                        accessibilityRole="button"
                                        hitSlop={10}
                                        onPress={() => setPasswordHidden(current => !current)}
                                        style={styles.eyeButton}>
                                        <EyeIcon hidden={passwordHidden} />
                                    </Pressable>
                                </View>
                            </View>
                        </View>

                        <Pressable
                            accessibilityRole="link"
                            hitSlop={8}
                            // TODO: CREATE ROUTE FOR FORGOT PASSWORD
                            onPress={() => router.push('/')}
                            style={styles.forgotButton}>
                            <Text style={styles.forgotText}>Forgot Password?</Text>
                        </Pressable>

                        {loginError ? <Text style={styles.loginError}>{loginError}</Text> : null}

                        <Pressable
                            accessibilityRole="button"
                            disabled={!canSubmit}
                            onPress={login}
                            style={({pressed}) => [
                                styles.loginButton,
                                !canSubmit && styles.loginButtonDisabled,
                                pressed && canSubmit && styles.pressed,
                            ]}>
                            {isSubmitting ? (
                                <ActivityIndicator color="#FFFFFF" />
                            ) : (
                                <Text style={styles.loginButtonText}>Log In</Text>
                            )}
                        </Pressable>

                        <View style={styles.signupRow}>
                            <Text style={styles.signupPrompt}>Don&apos;t have an account? </Text>
                            <Pressable
                                accessibilityRole="link"
                                hitSlop={8}
                                onPress={() => router.replace('/signup')}>
                                <Text style={styles.signupLink}>Sign up</Text>
                            </Pressable>
                        </View>
                    </View>
                </View>
            </KeyboardAvoidingView>
        </SafeAreaView>
        </SafeAreaProvider>
    );
}

const styles = StyleSheet.create({
    flex: {flex: 1},
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
        paddingTop: 14,
        paddingBottom: 24,
    },
    topBar: {
        height: 54,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    backButton: {
        width: 38,
        height: 38,
        alignItems: 'flex-start',
        justifyContent: 'center',
    },
    brandName: {
        color: '#1D1D22',
        fontSize: 22,
        fontWeight: '800',
        letterSpacing: -0.4,
    },
    topBarSpacer: {width: 38},
    loginPanel: {
        flex: 1,
        justifyContent: 'center',
        paddingBottom: 46,
    },
    intro: {marginBottom: 32},
    title: {
        color: '#1D1D22',
        fontSize: 30,
        lineHeight: 36,
        fontWeight: '800',
        letterSpacing: -0.7,
    },
    subtitle: {
        color: '#62626D',
        fontSize: 16,
        lineHeight: 23,
        marginTop: 7,
    },
    form: {gap: 22},
    fieldGroup: {width: '100%'},
    label: {
        color: '#595963',
        fontSize: 13,
        fontWeight: '700',
        marginBottom: 8,
    },
    inputShell: {
        minHeight: 60,
        borderWidth: 1.3,
        borderColor: '#DDDDE8',
        borderRadius: 18,
        backgroundColor: '#FFFFFF',
        flexDirection: 'row',
        alignItems: 'center',
    },
    inputShellError: {borderColor: '#D55454'},
    input: {
        flex: 1,
        height: 58,
        paddingHorizontal: 17,
        color: '#212126',
        fontSize: 16,
    },
    eyeButton: {
        width: 50,
        height: 58,
        alignItems: 'center',
        justifyContent: 'center',
    },
    fieldError: {
        color: '#C33F3F',
        fontSize: 12,
        lineHeight: 17,
        marginTop: 6,
        paddingHorizontal: 2,
    },
    forgotButton: {
        alignSelf: 'flex-end',
        paddingVertical: 5,
        marginTop: 14,
        marginBottom: 25,
    },
    forgotText: {color: BRAND, fontSize: 15, fontWeight: '600'},
    loginError: {
        color: '#C33F3F',
        fontSize: 13,
        lineHeight: 18,
        textAlign: 'center',
        marginTop: -10,
        marginBottom: 14,
    },
    loginButton: {
        minHeight: 60,
        borderRadius: 19,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: BRAND,
    },
    loginButtonDisabled: {opacity: 0.42},
    loginButtonText: {
        color: '#FFFFFF',
        fontSize: 17,
        fontWeight: '700',
    },
    signupRow: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 22,
    },
    signupPrompt: {color: '#656570', fontSize: 15},
    signupLink: {color: BRAND, fontSize: 15, fontWeight: '700'},
    pressed: {opacity: 0.75, transform: [{scale: 0.99}]},
});
