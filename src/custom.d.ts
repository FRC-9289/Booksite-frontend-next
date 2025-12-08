// I was facing some errors with .module.css, so I asked chat to help me fix this and it told me to create this file,
// don't know how it works but it does

declare module '*.module.css' {
  const classes: { [key: string]: string };
  export default classes;
}
