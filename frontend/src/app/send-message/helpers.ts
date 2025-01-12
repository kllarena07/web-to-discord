type MessageRequest = {
  message: string;
  dateTime: string;
  files: File[];
};

export const fdToMessageReq = (formData: FormData): MessageRequest => {
  const message = formData.get("message") as string;
  const dateTime = formData.get("dateTime") as string;
  const files: File[] = [];

  formData.getAll("files").forEach((file) => {
    if (file instanceof File) {
      files.push(file);
    }
  });

  return {
    message,
    dateTime,
    files,
  };
};
