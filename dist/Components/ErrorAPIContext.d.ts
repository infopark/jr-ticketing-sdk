import React from "react";
export declare const ErrorAPIContext: React.Context<{
    error: null;
    addError: any;
    removeError: () => void;
}>;
export default function ErrorAPIProvider({ children }: {
    children: any;
}): JSX.Element;
