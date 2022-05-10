const typesDictionary = {
  CORRESPONDENCE: { icon: "envelope", name: "emails" },
  TASK: { icon: "check-square", name: "tasks" },
  MEMO: { icon: "sticky-note", name: "memos" },
  CALL: { icon: "phone", name: "calls" },
  APPOINTMENT: { icon: "calendar", name: "appointments" },
};

const matchIconToType = (type) => typesDictionary[type].icon || type;

const activityTypes = Object.keys(typesDictionary);

export { matchIconToType, activityTypes, typesDictionary };
