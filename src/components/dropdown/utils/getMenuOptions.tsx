export const getMenuOptions = (config: any) => {
  const { multiple, options, search, searchQuery, value, labels } = config;

  let filteredOptions = options;
  // filter out active options
  if (multiple && labels.lenght != 0) {
    let names = labels.map((l: any) => l.value);
    filteredOptions = filteredOptions.filter(
      (opt: any) => !names.includes(opt.value)
    );
  }

  // filter by search query
  if (search && searchQuery) {
    if (typeof search === "function") {
      filteredOptions = search(searchQuery, options);
    }

    const regxp = new RegExp(searchQuery, "i");
    return filteredOptions.filter((opt: any) => regxp.test(opt.text));
  }

  console.log("filting search", filteredOptions);
  return filteredOptions;
};
