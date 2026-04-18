export const findMissingFields = (formId: string): string[] => {
  const form = document.getElementById(formId) as HTMLFormElement | null;

  if (!form) {
    console.error("Form not found");
    return [];
  }

  // 1. Get all fields that are marked required
  const requiredFields = Array.from(
    form.querySelectorAll<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>('[required]')
  );

  const missingElements: (HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement)[] = [];
  const processedRadioNames = new Set<string>();

  requiredFields.forEach((field) => {
    // Handle Radio Buttons
    if (field instanceof HTMLInputElement && field.type === 'radio') {
      const name = field.name;
      if (!name || processedRadioNames.has(name)) return;

      // Check if any radio in this group is checked
      const group = form.querySelectorAll<HTMLInputElement>(`input[type="radio"][name="${name}"]`);
      const isAnyChecked = Array.from(group).some(radio => radio.checked);
      
      if (!isAnyChecked) {
        missingElements.push(field);
      }
      processedRadioNames.add(name);
      return;
    }

    // Handle Checkboxes
    if (field instanceof HTMLInputElement && field.type === 'checkbox') {
      if (!field.checked) missingElements.push(field);
      return;
    }

    // Handle Text, Email, Number, Select, TextArea
    if (!field.value.trim()) {
      missingElements.push(field);
    }
  });

  // 2. Map to Labels
  return missingElements.map((field) => {
    const labelText = field.labels && field.labels.length > 0 
      ? field.labels[0].textContent?.trim() 
      : null;



    return field.name || labelText || field.getAttribute('aria-label') || field.id || "Unknown Field";
  });
};

