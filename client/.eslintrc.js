module.exports = {
    env: {
        browser: true,
        es2021: true,
        'cypress/globals': true,
    },
    extends: ["eslint:recommended", "plugin:react/recommended", "plugin:cypress/recommended"],
    overrides: [
        {
            env: {
                node: true,
            },
            files: [".eslintrc.{js,cjs}"],
            parserOptions: {
                sourceType: "script",
            },
        },
    ],
    parserOptions: {
        ecmaVersion: "latest",
        sourceType: "module",
    },
    plugins: ["react", "cypress"], // Add 'cypress' to the list of plugins
    settings: {
        react: {
            version: "detect", // React version. "detect" automatically picks the version from your project.
        },
    },
    rules: {
        "react/react-in-jsx-scope": "off",
        "no-extra-semi": "off",
        "react/prop-types": "off",
    },
};
