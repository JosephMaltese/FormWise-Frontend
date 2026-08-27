import {ReactNode, useState} from 'react';
import {
    ActivityIndicator,
    KeyboardAvoidingView,
    Platform,
    Pressable,
    ScrollView,
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

const validPasswordOptions = {
    minLength: 8,
    minLowercase: 1,
    minUppercase: 1,
    minNumbers: 1,
    minSymbols: 1,
    returnScore: false,
    pointsPerUnique: 1,
    pointsPerRepeat: 0.5,
    pointsForContainingLower: 10,
    pointsForContainingUpper: 10,
    pointsForContainingNumber: 10,
    pointsForContainingSymbol: 10,
};

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

type FieldProps = {
    label: string;
    value: string;
    onChangeText: (value: string) => void;
    placeholder: string;
    secureTextEntry?: boolean;
    onToggleSecure?: () => void;
    keyboardType?: 'default' | 'email-address';
    error?: string;
    textContentType?:
        | 'name'
        | 'emailAddress'
        | 'newPassword'
        | 'password';
};

function FormField({
                       label,
                       value,
                       onChangeText,
                       placeholder,
                       secureTextEntry,
                       onToggleSecure,
                       keyboardType = 'default',
                       error,
                       textContentType,
                   }: FieldProps) {
    return (
        <View style={styles.fieldGroup}>
            <Text style={styles.label}>{label}</Text>
            <View style={[styles.inputShell, error && styles.inputShellError]}>
                <TextInput
                    value={value}
                    onChangeText={onChangeText}
                    placeholder={placeholder}
                    placeholderTextColor="#A1A1AA"
                    autoCapitalize={
                        keyboardType === 'email-address' || secureTextEntry ? 'none' : 'words'
                    }
                    autoCorrect={false}
                    keyboardType={keyboardType}
                    secureTextEntry={secureTextEntry}
                    textContentType={textContentType}
                    style={styles.input}
                />
                {onToggleSecure ? (
                    <Pressable
                        accessibilityLabel={secureTextEntry ? 'Show password' : 'Hide password'}
                        accessibilityRole="button"
                        hitSlop={10}
                        onPress={onToggleSecure}
                        style={styles.eyeButton}>
                        <EyeIcon hidden={Boolean(secureTextEntry)} />
                    </Pressable>
                ) : null}
            </View>
            {error ? <Text style={styles.fieldError}>{error}</Text> : null}
        </View>
    );
}

export default function Signup(): ReactNode {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [email, setEmail] = useState('');
    const [passwordTouched, setPasswordTouched] = useState(false);
    const [confirmTouched, setConfirmTouched] = useState(false);
    const [passwordHidden, setPasswordHidden] = useState(true);
    const [confirmPasswordHidden, setConfirmPasswordHidden] = useState(true);
    const [acceptedTerms, setAcceptedTerms] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [signupError, setSignupError] = useState('');
    const {signUpNewUser} = useAuthSession();

    const passwordIsStrong = validator.isStrongPassword(
        password,
        validPasswordOptions,
    );
    const passwordsMatch = password === confirmPassword;
    const emailIsValid = validator.isEmail(email.trim());

    const canSubmit =
        username.trim().length > 0 &&
        emailIsValid &&
        passwordIsStrong &&
        passwordsMatch &&
        confirmPassword.length > 0 &&
        acceptedTerms &&
        !isSubmitting;

    const signup = async (): Promise<void> => {
        setPasswordTouched(true);
        setConfirmTouched(true);

        if (!canSubmit) return;

        const strippedUsername = validator.trim(username);
        const normalizedEmail = validator.normalizeEmail(email.trim());

        if (!normalizedEmail) {
            setSignupError('Please enter a valid email address.');
            return;
        }

        setIsSubmitting(true);
        setSignupError('');

        try {
            const result = await signUpNewUser(
                normalizedEmail,
                password,
                strippedUsername,
            );

            if (result.success) {
                router.replace('/(authorized)/(tabs)');
            } else {
                setSignupError('We could not create your account. Please try again.');
            }
        } catch {
            setSignupError('Something went wrong. Please try again.');
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
                <ScrollView
                    bounces={false}
                    contentContainerStyle={styles.scrollContent}
                    keyboardShouldPersistTaps="handled"
                    showsVerticalScrollIndicator={false}>
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

                    <View style={styles.intro}>
                        <Text style={styles.title}>Create Account</Text>
                        <Text style={styles.subtitle}>
                            Start building stronger, safer lifting habits.
                        </Text>
                    </View>

                    <View style={styles.form}>
                        <FormField
                            label="FULL NAME"
                            value={username}
                            onChangeText={setUsername}
                            placeholder="Your name"
                            textContentType="name"
                        />

                        <FormField
                            label="EMAIL ADDRESS"
                            value={email}
                            onChangeText={setEmail}
                            placeholder="you@example.com"
                            keyboardType="email-address"
                            textContentType="emailAddress"
                            error={email.length > 0 && !emailIsValid ? 'Enter a valid email address.' : undefined}
                        />

                        <FormField
                            label="PASSWORD"
                            value={password}
                            onChangeText={value => {
                                setPassword(value);
                                setPasswordTouched(true);
                            }}
                            placeholder="Create a password"
                            secureTextEntry={passwordHidden}
                            onToggleSecure={() => setPasswordHidden(current => !current)}
                            textContentType="newPassword"
                            error={
                                passwordTouched && password.length > 0 && !passwordIsStrong
                                    ? 'Use 8+ characters with uppercase, lowercase, a number, and a symbol.'
                                    : undefined
                            }
                        />

                        <FormField
                            label="CONFIRM PASSWORD"
                            value={confirmPassword}
                            onChangeText={value => {
                                setConfirmPassword(value);
                                setConfirmTouched(true);
                            }}
                            placeholder="Repeat your password"
                            secureTextEntry={confirmPasswordHidden}
                            onToggleSecure={() =>
                                setConfirmPasswordHidden(current => !current)
                            }
                            textContentType="password"
                            error={
                                confirmTouched && confirmPassword.length > 0 && !passwordsMatch
                                    ? 'Passwords do not match.'
                                    : undefined
                            }
                        />
                    </View>

                    <Pressable
                        accessibilityRole="checkbox"
                        accessibilityState={{checked: acceptedTerms}}
                        onPress={() => setAcceptedTerms(current => !current)}
                        style={styles.termsRow}>
                        <View style={[styles.checkbox, acceptedTerms && styles.checkboxChecked]}>
                            {acceptedTerms ? <Text style={styles.checkmark}>✓</Text> : null}
                        </View>
                        <Text style={styles.termsText}>
                            I agree to the <Text style={styles.link}>Terms of Service</Text> &{' '}
                            <Text style={styles.link}>Privacy Policy</Text>
                        </Text>
                    </Pressable>

                    {signupError ? <Text style={styles.submitError}>{signupError}</Text> : null}

                    <Pressable
                        accessibilityRole="button"
                        disabled={!canSubmit}
                        onPress={signup}
                        style={({pressed}) => [
                            styles.createButton,
                            !canSubmit && styles.createButtonDisabled,
                            pressed && canSubmit && styles.pressed,
                        ]}>
                        {isSubmitting ? (
                            <ActivityIndicator color="#FFFFFF" />
                        ) : (
                            <Text style={styles.createButtonText}>Create Account</Text>
                        )}
                    </Pressable>

                    <View style={styles.loginRow}>
                        <Text style={styles.loginPrompt}>Already have an account? </Text>
                        <Pressable
                            accessibilityRole="link"
                            hitSlop={8}
                            onPress={() => router.replace('/login')}>
                            <Text style={styles.loginLink}>Log in</Text>
                        </Pressable>
                    </View>
                </ScrollView>
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
    scrollContent: {
        flexGrow: 1,
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
    intro: {marginTop: 18, marginBottom: 26},
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
        marginTop: 6,
    },
    form: {gap: 17},
    fieldGroup: {width: '100%'},
    label: {
        color: '#595963',
        fontSize: 13,
        fontWeight: '700',
        marginBottom: 8,
    },
    inputShell: {
        minHeight: 58,
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
        height: 56,
        paddingHorizontal: 17,
        color: '#212126',
        fontSize: 16,
    },
    eyeButton: {
        width: 48,
        height: 56,
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
    termsRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 24,
        marginBottom: 24,
    },
    checkbox: {
        width: 20,
        height: 20,
        borderWidth: 1.5,
        borderColor: '#A9A9B4',
        borderRadius: 5,
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 10,
    },
    checkboxChecked: {
        borderColor: BRAND,
        backgroundColor: BRAND,
    },
    checkmark: {
        color: '#FFFFFF',
        fontSize: 14,
        lineHeight: 16,
        fontWeight: '800',
    },
    termsText: {
        flex: 1,
        color: '#64646F',
        fontSize: 13,
        lineHeight: 19,
    },
    link: {color: BRAND, fontWeight: '700'},
    submitError: {
        color: '#C33F3F',
        fontSize: 13,
        lineHeight: 18,
        textAlign: 'center',
        marginTop: -12,
        marginBottom: 12,
    },
    createButton: {
        minHeight: 60,
        borderRadius: 19,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: BRAND,
    },
    createButtonDisabled: {opacity: 0.42},
    createButtonText: {
        color: '#FFFFFF',
        fontSize: 17,
        fontWeight: '700',
    },
    loginRow: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 20,
    },
    loginPrompt: {color: '#656570', fontSize: 15},
    loginLink: {color: BRAND, fontSize: 15, fontWeight: '700'},
    pressed: {opacity: 0.75, transform: [{scale: 0.99}]},
});
