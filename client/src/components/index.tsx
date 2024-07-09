import React from "react";

interface Props<T> {
  onSubmit: (data: T) => void;
  children: any;
  className?: string;
}

export function Form<T>({ onSubmit, children, className }: Props<T>) {
  const ref = React.createRef<HTMLFormElement>();

  const handleSubmit = (evt: SubmitEvent) => {
    evt.preventDefault();
    const formData = new FormData(evt.target as HTMLFormElement);
    onSubmit(Object.fromEntries(formData.entries()) as T);
  };

  React.useEffect(() => {
    const form = ref.current;
    if (form) {
      form.addEventListener("submit", handleSubmit);
    }
    return () => {
      if (form) {
        form.removeEventListener("submit", handleSubmit);
      }
    };
  }, []);

  return (
    <form className={className} ref={ref}>
      {children}
    </form>
  );
}
