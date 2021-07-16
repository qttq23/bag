import { Todo } from "../model/Todo";
const typelessWindow: any = window;


export interface TodoDb {

    getTodos: () => Promise<Array<Todo>>;
    createTodo: (text: string) => Promise<boolean>;
}

class TodoDbLocal implements TodoDb {
    getTodos = async () => {

        return [new Todo('local')];
    };

    createTodo = async (text: string) => {
        return false;
    }
}

class TodoDbOnline implements TodoDb {
    getTodos = async () => {
        return [new Todo('online'), new Todo('online2')];
    }

    createTodo = async (text: string) => {
        return true;
    }
}

/** extension storage */
class TodoDbStorage implements TodoDb {
    getTodos = async () => {


        typelessWindow.chrome.runtime.sendMessage({
            type: 'hello',
        }, function (response: object) {
            console.log(response);
        });

        return [new Todo('storage'), new Todo('storage2'), new Todo('storage3')];
    }

    createTodo = async (text: string) => {
        return true;
    }
}


/** web storage */
class TodoDbStorageWeb implements TodoDb {
    getTodos = async () => {

        let todos = [
            {
                id: '2'
            }
        ];
        window.localStorage.setItem("todos", "Smith");

        typelessWindow.chrome.runtime.sendMessage({
            type: 'hello',
        }, function (response: object) {
            console.log(response);
        });

        return [new Todo('storage'), new Todo('storage2'), new Todo('storage3')];
    }

    createTodo = async (text: string) => {
        return true;
    }
}

export class TodoDbHelper {
    static getTodoDb(): TodoDb {
        if (typelessWindow.RE) {
            console.log('local app');
            window.document.title = typelessWindow.RE.thang;
            return new TodoDbLocal();
        }
        else if (typelessWindow.chrome && typelessWindow.chrome.tabs) {
            console.log('extension');
            return new TodoDbStorage();
        }

        return new TodoDbOnline();
    }
}