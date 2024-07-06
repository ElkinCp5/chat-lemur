export const Form: React.FC<{
  onSubmit: <T>(data: T) => void;
  children: any;
}> = ({ onSubmit, children }) => {
  function submit(evt: any) {
    evt.preventDefault();
    const formData = new FormData(evt.target);
    const data: any = Object.fromEntries(formData.entries());
    onSubmit(data);
  }
  return <form onSubmit={submit}>{children}</form>;
};
