"use client";

import React, { useState } from "react";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";
import MDEditor from "@uiw/react-md-editor";
import { Button } from "./ui/button";
import { Send } from "lucide-react";
import { useActionState } from "react";
import { formSchema } from "@/lib/validation";
import { z } from "zod";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { createPitch } from "@/lib/actions";

const StartupForm = () => {
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [pitch, setPitch] = useState<string | undefined>("");
  const [formValues, setFormValues] = useState({
    title: "",
    description: "",
    category: "",
    link: "",
  });
  const router = useRouter();

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormValues((prev) => ({ ...prev, [name]: value }));
  };

  const handleFormSubmit = async (prevState: any, formData: FormData) => {
    try {
      const values = {
        ...formValues,
        pitch,
      };

      await formSchema.parseAsync(values);

      console.log(formValues);

      const result = await createPitch(prevState, formData, pitch || "");
      console.log("Form submitted successfully:", result);

      if (result.status === "SUCCESS") {
        toast.success("Success", {
          description: "Your startup pitch has been created successfully.",
        });
        setFormValues({
          title: "",
          description: "",
          category: "",
          link: "",
        });
        setPitch("");
        router.push(`/startup/${result._id}`);
      }

      return result;
    } catch (error) {
      if (error instanceof z.ZodError) {
        const fieldErorrs = error.flatten().fieldErrors;

        setErrors(fieldErorrs as unknown as Record<string, string>);

        toast.error("Error", {
          description: "Please check your inputs and try again.",
        });

        return { ...prevState, error: "Validation failed", status: "ERROR" };
      }

      toast.error("Error", {
        description: "An unexpected error occurred.",
      });

      return {
        ...prevState,
        error: "An unexpected error occurred",
        status: "ERROR",
      };
    }
  };

  const [state, formAction, isPending] = useActionState(handleFormSubmit, {
    error: "",
    status: "INITIAL",
  });

  return (
    <form action={formAction} className="startup-form">
      <div>
        <label htmlFor="title" className="startup-form_label">
          Title
        </label>
        <Input
          id="title"
          name="title"
          type="text"
          className="startup-form_input"
          required
          placeholder="Startup Title"
          value={formValues.title}
          onChange={handleChange}
        />
        {errors.title && <p className="startup-form_error">{errors.title}</p>}
      </div>

      <div>
        <label htmlFor="description" className="startup-form_label">
          Description
        </label>
        <Textarea
          id="description"
          name="description"
          className="startup-form_textarea"
          required
          placeholder="Startup Description"
          value={formValues.description}
          onChange={handleChange}
        />
        {errors.description && (
          <p className="startup-form_error">{errors.description}</p>
        )}
      </div>

      <div>
        <label htmlFor="category" className="startup-form_label">
          Category
        </label>
        <Input
          id="category"
          name="category"
          type="text"
          className="startup-form_input"
          required
          placeholder="Startup Category (Tech, Health, Education, etc.)"
          value={formValues.category}
          onChange={handleChange}
        />
        {errors.category && (
          <p className="startup-form_error">{errors.category}</p>
        )}
      </div>

      <div>
        <label htmlFor="link" className="startup-form_label">
          Image URL
        </label>
        <Input
          id="link"
          name="link"
          type="text"
          className="startup-form_input"
          required
          placeholder="Startup Image URL"
          value={formValues.link}
          onChange={handleChange}
        />
        {errors.link && <p className="startup-form_error">{errors.link}</p>}
      </div>

      <div data-color-mode="light">
        <label htmlFor="pitch" className="startup-form_label block mb-3">
          Pitch
        </label>
        <MDEditor
          id="pitch"
          value={pitch}
          preview="edit"
          height={300}
          style={{ borderRadius: 20, overflow: "hidden" }}
          textareaProps={{
            placeholder: "Write your pitch here...",
          }}
          previewOptions={{
            disallowedElements: ["style"],
          }}
          onChange={(value) => setPitch(value as string)}
        />
        {errors.pitch && <p className="startup-form_error">{errors.pitch}</p>}
      </div>

      <Button type="submit" className="startup-form_btn" disabled={isPending}>
        {isPending ? "Submitting..." : "Submit Startup"}
        <Send className="size-6 ml-2" />
      </Button>
    </form>
  );
};

export default StartupForm;
