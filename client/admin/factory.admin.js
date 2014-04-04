module.exports = function AdminService($http) {

  function createCategory(category) {
    return $http.post('/api/categories', category);
  }

  function createCompany (company) {
    return $http.post('/api/companies', company);
  }

  function createProduct (product) {
    return $http.post('/api/products', product);
  }

  function createQuestion(question) {
    return $http.post('/api/questions', question);
  }

  function createSubCategory(category, subCategory) {
    return $http.post('/api/subcategories', {category: category, subcategory: subCategory});
  }

  function createWrappedSubCategory(training, subCategory) {
    return $http.post('/api/subcategories/wrapped', {training: training, subcategory: subCategory});
  }

  function deleteCategory(category) {
    return $http.delete('/api/categories/' + category._id);
  }

  function deleteCompany(company) {
    return $http.delete('/api/companies/' + company._id);
  }

  function deleteQuestion(question) {
    return $http.delete('/api/questions/' + question._id);
  }

  function deleteSubCategory(subCategory) {
    return $http.delete('/api/subcategories/' + subCategory._id);
  }

  function deleteTraining(training) {
    return $http.delete('/api/training/' + training._id);
  }

  function deleteWrappedSubCategory(subCategory) {
    return $http.delete('/api/subcategories/wrapped/' + subCategory._id);
  }

  function getAdminData () {
    return $http.get('/api/admin/data');
  }

  function getCategories() {
    return $http.get('/api/categories');
  }

  function updateCategory(category) {
    return $http.put('/api/categories/' + category._id, category);
  }

  function updateCompany(company) {
    return $http.put('/api/companies/' + company._id, company);
  }

  function updateProduct(product) {
    return $http.put('/api/products/' + product._id, product);
  }

  function updateQuestion(question) {
    return $http.put('/api/questions/' + question._id, question);
  }

  function updateSubCategory(subCategory) {
    return $http.put('/api/subcategories/' + subCategory._id, subCategory);
  }

  function updateTraining(training) {
    return $http.put('/api/training/' + training._id, training);
  }

  function updateWrappedSubCategory(subCategory) {
    return $http.put('/api/subcategories/wrapped/' + subCategory._id, subCategory);
  }

  return {
    createCategory: createCategory,
    createCompany: createCompany,
    createProduct: createProduct,
    createQuestion: createQuestion,
    createSubCategory: createSubCategory,
    createWrappedSubCategory: createWrappedSubCategory,
    deleteCategory: deleteCategory,
    deleteCompany: deleteCompany,
    deleteQuestion: deleteQuestion,
    deleteSubCategory: deleteSubCategory,
    deleteWrappedSubCategory: deleteWrappedSubCategory,
    deleteTraining: deleteTraining,
    getAdminData: getAdminData,
    getCategories: getCategories,
    updateCategory: updateCategory,
    updateCompany: updateCompany,
    updateProduct: updateProduct,
    updateQuestion: updateQuestion,
    updateSubCategory: updateSubCategory,
    updateTraining: updateTraining,
    updateWrappedSubCategory: updateWrappedSubCategory
  };
};