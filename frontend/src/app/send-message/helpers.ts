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

import {
  SchedulerClient,
  CreateScheduleCommand,
  FlexibleTimeWindowMode,
  ActionAfterCompletion,
} from "@aws-sdk/client-scheduler";

const AWS_REGION = process.env.AWS_REGION!;
const TARGET_LAMBDA_ARN = process.env.TARGET_LAMBDA_ARN!;
const SCHEDULER_ACCESS_KEY_ID = process.env.SCHEDULER_ACCESS_KEY_ID!;
const SCHEDULER_SECRET_ACCESS_KEY = process.env.SCHEDULER_SECRET_ACCESS_KEY!;
const ROLE_ARN = process.env.ROLE_ARN!;
const SAFA_SO_GOOD = process.env.SAFA_SO_GOOD;
const UM_DEARBORN = process.env.UM_DEARBORN;

const schedulerClient = new SchedulerClient({
  region: AWS_REGION,
  credentials: {
    accessKeyId: SCHEDULER_ACCESS_KEY_ID,
    secretAccessKey: SCHEDULER_SECRET_ACCESS_KEY,
  },
});

export const scheduleLambdaInvocation = async (input: {
  message: string;
  dateTime: string;
  attachmentURLs: string[];
}) => {
  const { message, dateTime, attachmentURLs } = input;

  const scheduleParams = {
    Name: `lambda-${dateTime.replace(/[^0-9a-zA-Z-_.]/g, "")}`,
    ScheduleExpression: `cron(${new Date(dateTime).getUTCMinutes()} ${new Date(
      dateTime
    ).getUTCHours()} ${new Date(dateTime).getUTCDate()} ${
      new Date(dateTime).getUTCMonth() + 1
    } ? ${new Date(dateTime).getUTCFullYear()})`,
    FlexibleTimeWindow: {
      Mode: "OFF" as FlexibleTimeWindowMode,
    },
    Target: {
      Arn: TARGET_LAMBDA_ARN,
      RoleArn: ROLE_ARN,
      Input: JSON.stringify({
        message: `<@&${SAFA_SO_GOOD}> <@&${UM_DEARBORN}>\n\n${message}`,
        attachmentURLs,
      }),
    },
    ActionAfterCompletion: ActionAfterCompletion.DELETE,
  };

  try {
    const response = await schedulerClient.send(
      new CreateScheduleCommand(scheduleParams)
    );
    console.log("Schedule created successfully:", response);
  } catch (error) {
    console.error("Error creating schedule:", error);
  }
};
