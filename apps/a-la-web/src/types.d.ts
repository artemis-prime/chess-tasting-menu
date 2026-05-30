declare module "*.svg" {
  const content: React.FunctionComponent<React.SVGAttributes<SVGElement>>;
  export default content;
}

declare module "*.jpg" {
  const value: string;
  export default value;
}


declare module "*.png" {
  const value: string;
  export default value;
}

declare module "*.scss" {
  const content: { readonly [className: string]: string };
  export default content;
}

declare module "path"