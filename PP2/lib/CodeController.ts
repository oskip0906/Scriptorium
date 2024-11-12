export const saveCode = async (id: string, code: string, language:string, title:string, tags: Array<Object>, desc: string) => {
    const response = await fetch(`/api/CodeTemplates/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'authorization': 'Bearer ' + localStorage.getItem('accessToken')
      },
      body: JSON.stringify({ code: code, language: language, title: title, tags: tags, desc: desc })
    });
    const data = await response.json();

    if (!response.ok) {
      console.error('Error saving code');
      return;
    }
    console.log(data);
    alert('Code saved successfully');
  }
  
export const deleteCode = async  (id: string, code: string, language:string, title:string, tags: Object, desc: string) => {
    const response = await fetch(`/api/CodeTemplates/${id}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        'authorization': 'Bearer ' + localStorage.getItem('accessToken')
        }
    });
    const data = await response.json();
    console.log(data);
    }

export const forkCode = async  (id: string) => {
    const response = await fetch(`/api/CodeTemplates/Fork`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'authorization': 'Bearer ' + localStorage.getItem('accessToken')
        },
        body: JSON.stringify({ id: id })
    });
    const data = await response.json();
    console.log(data);
    }