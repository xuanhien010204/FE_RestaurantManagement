import { GoogleLogin, type CredentialResponse } from "@react-oauth/google";
import type { FC } from "react";

interface Props {
    onSuccess: (idToken: string) => void;
    onError?: (err?: unknown) => void;
}

const GoogleLoginButton: FC<Props> = ({ onSuccess, onError }) => {
    return (
        <div>
            {/* Keep the branded GoogleLogin for the official look; it also handles OneTap if enabled. */}
            <GoogleLogin
                onSuccess={(credentialResponse: CredentialResponse) => {
                    const idToken = credentialResponse && typeof credentialResponse.credential === "string" ? credentialResponse.credential : undefined;
                    if (idToken) onSuccess(idToken);
                    else onError?.(new Error("No credential returned"));
                }}
                onError={() => onError?.(new Error("Google login failed"))}
                useOneTap={false}
                text="signin_with"
            />
        </div>
    );
};

export default GoogleLoginButton;
