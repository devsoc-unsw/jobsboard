module.exports = {
    root: true,
    parser: '@typescript-eslint/parser',
    parserOptions: {
        tsconfigRootDir: __dirname,
        project: ['./tsconfig.json'],
    },
    plugins: ['@typescript-eslint'],
    extends: [
        'eslint:recommended', 
        'plugin:@typescript-eslint/recommended',
        'plugin:@typescript-eslint/recommended-requiring-type-checking',
        'prettier',
        "plugin:prettier/recommended",
    ],
    // all the rules have been set to warning for now after reading below
    // https://github.com/typescript-eslint/typescript-eslint/issues/2767#issuecomment-728144784
    rules: {
        "@typescript-eslint/adjacent-overload-signatures": "warn",
        "@typescript-eslint/ban-ts-comment": "warn",
        "@typescript-eslint/ban-types": [
            "warn",
            {
                // when adding a new type to be banned, please include a custom 
                // message explaining why it should not be used 
                "types": {
                },
                "extendDefaults": true
            },
        ],
        "@typescript-eslint/member-ordering": [
            "warn",
            {
                "default": {
                    "memberTypes": ["signature", "method", "constructor", "field"],
                    "order": "alphabetically"
                }
            }
        ],
        "@typescript-eslint/no-empty-interface": "warn",
        // below should be enabled but so much of our backend uses any as the type 
        // "@typescript-eslint/no-explicit-any": "warn",
        "@typescript-eslint/no-extra-non-null-assertion": "warn",
        "@typescript-eslint/no-floating-promises": "warn",
        "@typescript-eslint/no-for-in-array": "warn",
        "@typescript-eslint/no-inferrable-types": "warn",
        "@typescript-eslint/no-misused-new": "warn",
        "@typescript-eslint/no-misused-promises": "warn",
        "@typescript-eslint/no-namespace": "warn",
        "@typescript-eslint/no-non-null-asserted-optional-chain": "warn",
        "@typescript-eslint/no-non-null-assertion": "warn",
        "@typescript-eslint/no-this-alias": "warn",
        "@typescript-eslint/no-unnecessary-type-assertion": "warn",
        "@typescript-eslint/no-unnecessary-type-constraint": "warn",
        // below should be enabled but so much of our backend uses any as the type 
        // "@typescript-eslint/no-unsafe-argument": "warn",
        // "@typescript-eslint/no-unsafe-assignment": "warn",
        // "@typescript-eslint/no-unsafe-call": "warn"
        // "@typescript-eslint/no-unsafe-member-access": "warn",
        "@typescript-eslint/no-unsafe-return": "warn",
        "@typescript-eslint/no-var-requires": "warn",
        "@typescript-eslint/prefer-as-const": "warn",
        "@typescript-eslint/restrict-plus-operands": "warn",
        "@typescript-eslint/triple-slash-reference": "warn",
        "@typescript-eslint/unbound-method": "warn"
    },
};