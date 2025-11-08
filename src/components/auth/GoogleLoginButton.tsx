import { GoogleLogin, type CredentialResponse } from "@react-oauth/google";
import type { FC } from "react";

interface Props {
    onSuccess: (idToken: string) => void;
    onError?: (err?: unknown) => void;
}

const GoogleLoginButton: FC<Props> = ({ onSuccess, onError }) => {
    return (
        <div className="flex justify-center">
            {/* Keep the branded GoogleLogin for the official look; it also handles OneTap if enabled. */}
            <GoogleLogin
                onSuccess={(credentialResponse: CredentialResponse) => {
                    const idToken = credentialResponse && typeof credentialResponse.credential === "string" ? credentialResponse.credential : undefined;
                    if (idToken) {
                        console.log('[GoogleLoginButton] Google login successful, idToken:', idToken.substring(0, 20) + '...');
                        onSuccess(idToken);
                    } else {
                        const error = new Error("No credential returned");
                        console.error('[GoogleLoginButton]', error);
                        onError?.(error);
                    }
                }}
                onError={() => {
                    const error = new Error("Google login failed");
                    console.error('[GoogleLoginButton]', error);
                    onError?.(error);
                }}
                useOneTap={false}
                text="signin_with"
            />
        </div>
    );
};

export default GoogleLoginButton;
