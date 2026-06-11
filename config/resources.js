export const RESOURCE_ORDER = ["students", "courses", "classes"];

export const RESOURCES = {
  students: {
    label: "Sinh viên",
    singular: "sinh viên",
    eyebrow: "Hồ sơ người học",
    description: "Quản lý thông tin liên hệ và ngày sinh",
    codeField: "student_code",
    titleField: "full_name",
    accent: "#E56A3B",
    softAccent: "#FBE8DF",
    searchPlaceholder: "Tìm mã, họ tên, email...",
    fields: [
      {
        key: "student_code",
        label: "Mã sinh viên",
        placeholder: "VD: SV001",
        required: true,
        maxLength: 20,
      },
      {
        key: "full_name",
        label: "Họ và tên",
        placeholder: "Nguyễn Văn An",
        required: true,
        maxLength: 100,
      },
      {
        key: "email",
        label: "Email",
        placeholder: "an@example.com",
        required: true,
        keyboardType: "email-address",
        autoCapitalize: "none",
        maxLength: 100,
      },
      {
        key: "phone",
        label: "Số điện thoại",
        placeholder: "0901 234 567",
        keyboardType: "phone-pad",
        maxLength: 20,
      },
      {
        key: "date_of_birth",
        label: "Ngày sinh",
        placeholder: "YYYY-MM-DD",
        maxLength: 10,
      },
    ],
    details: [
      { key: "email", label: "Email" },
      { key: "phone", label: "Điện thoại", fallback: "Chưa cập nhật" },
      {
        key: "date_of_birth",
        label: "Ngày sinh",
        fallback: "Chưa cập nhật",
        format: "date",
      },
    ],
  },
  courses: {
    label: "Môn học",
    singular: "môn học",
    eyebrow: "Danh mục đào tạo",
    description: "Theo dõi mã môn, tên môn và số tín chỉ",
    codeField: "course_code",
    titleField: "course_name",
    accent: "#1D7A6D",
    softAccent: "#DDEFEA",
    searchPlaceholder: "Tìm mã hoặc tên môn học...",
    fields: [
      {
        key: "course_code",
        label: "Mã môn học",
        placeholder: "VD: MOB402",
        required: true,
        maxLength: 20,
      },
      {
        key: "course_name",
        label: "Tên môn học",
        placeholder: "Lập trình di động",
        required: true,
        maxLength: 255,
      },
      {
        key: "credits",
        label: "Số tín chỉ",
        placeholder: "3",
        required: true,
        keyboardType: "number-pad",
        maxLength: 2,
      },
    ],
    details: [{ key: "credits", label: "Khối lượng", suffix: " tín chỉ" }],
  },
  classes: {
    label: "Lớp học",
    singular: "lớp học",
    eyebrow: "Tổ chức giảng dạy",
    description: "Xếp môn học theo học kỳ và phòng học",
    codeField: "class_code",
    titleField: "class_code",
    accent: "#C18A22",
    softAccent: "#F6EBCF",
    searchPlaceholder: "Tìm mã lớp, học kỳ, phòng...",
    fields: [
      {
        key: "class_code",
        label: "Mã lớp",
        placeholder: "VD: MOB402-01",
        required: true,
        maxLength: 50,
      },
      {
        key: "course_id",
        label: "Môn học",
        placeholder: "Chọn môn học",
        required: true,
        type: "course",
      },
      {
        key: "semester",
        label: "Học kỳ",
        placeholder: "VD: Spring 2026",
        required: true,
        maxLength: 20,
      },
      {
        key: "room",
        label: "Phòng học",
        placeholder: "VD: P.302",
        maxLength: 50,
      },
    ],
    details: [
      { key: "course_id", label: "Môn học", format: "course" },
      { key: "semester", label: "Học kỳ" },
      { key: "room", label: "Phòng học", fallback: "Chưa xếp phòng" },
    ],
  },
};

export function createEmptyForm(resource) {
  return RESOURCES[resource].fields.reduce((form, field) => {
    form[field.key] = field.key === "credits" ? "3" : "";
    return form;
  }, {});
}

export function itemToForm(resource, item) {
  return RESOURCES[resource].fields.reduce((form, field) => {
    const rawValue = item?.[field.key];
    form[field.key] =
      field.key === "date_of_birth" && rawValue
        ? String(rawValue).slice(0, 10)
        : rawValue === null || rawValue === undefined
          ? ""
          : String(rawValue);
    return form;
  }, {});
}

export function formToPayload(resource, form) {
  return RESOURCES[resource].fields.reduce((payload, field) => {
    const value = String(form[field.key] ?? "").trim();

    if (field.key === "credits" || field.key === "course_id") {
      payload[field.key] = value ? Number(value) : null;
    } else {
      payload[field.key] = value || null;
    }

    return payload;
  }, {});
}

export function validateForm(resource, form) {
  const config = RESOURCES[resource];
  const missingField = config.fields.find(
    (field) => field.required && !String(form[field.key] ?? "").trim(),
  );

  if (missingField) {
    return `Vui lòng nhập ${missingField.label.toLowerCase()}.`;
  }

  if (
    resource === "students" &&
    !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim())
  ) {
    return "Email chưa đúng định dạng.";
  }

  if (
    resource === "students" &&
    form.date_of_birth.trim() &&
    !/^\d{4}-\d{2}-\d{2}$/.test(form.date_of_birth.trim())
  ) {
    return "Ngày sinh cần có định dạng YYYY-MM-DD.";
  }

  if (
    resource === "courses" &&
    (!Number.isInteger(Number(form.credits)) || Number(form.credits) <= 0)
  ) {
    return "Số tín chỉ phải là số nguyên lớn hơn 0.";
  }

  return "";
}
