import React from "react";
import useForm from "./hooks/useForm";

import { Form } from "./Form";
import { FormItem } from "./FormItem";

export const SandboxForm = () => {
  const [form] = useForm();

  const onFinish = (values: any) => {
    console.log("Success:", values);
  };

  const onFinishFailed = (errorInfo: any) => {
    console.log("Failed:", errorInfo);
  };

  return (
    <div>
      <h2>Form</h2>
      <Form form={form} onFinish={onFinish} onFinishFailed={onFinishFailed}>
        <FormItem
          name="text"
          label="Text"
          rules={[
            // { required: true },
            { type: "string", min: 4 },
          ]}
        >
          <input placeholder="text 1" />
        </FormItem>
        <FormItem
          name="note"
          label="Note"
          rules={[{ required: true }, { type: "string", min: 6 }]}
        >
          <input placeholder="Node 1" />
        </FormItem>
        <FormItem
          name="names"
          label="Names"
          rules={[
            { required: true },
            {
              //@ts-ignore
              validator: async (_, names) => {
                if (!names || names.length < 2) {
                  return Promise.reject(new Error("At least 2 passengers"));
                }
              },
            },
          ]}
        >
          <input placeholder="text 2" />
        </FormItem>
        {/* <FormItem
          name="url"
          label="URL"
          rules={[
            { required: true },
            { type: "url", warningOnly: true },
            { type: "string", min: 6 },
          ]}
        >
          <input placeholder="url" />
        </FormItem> */}
        <div>
          <button type="submit">send button</button>
        </div>
      </Form>
    </div>
  );
};
