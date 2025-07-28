document.addEventListener('DOMContentLoaded', () => {
    const studentForm = document.getElementById('student-form');
    const msvInput = document.getElementById('msv');
    const tenInput = document.getElementById('ten');
    const emailInput = document.getElementById('email');
    const ngaysinhInput = document.getElementById('ngaysinh');
    const ghichuInput = document.getElementById('ghichu');
    const studentList = document.getElementById('student-list');
    const submitBtn = studentForm.querySelector('button[type="submit"]');
    const formTitle = document.getElementById('form-title');
    const alertPlaceholder = document.getElementById('alert-placeholder');

    let students = [
        { id: '2251061742', name: 'Phạm Đức Đô', email: 'odcud1234@gmail.com', gender: 'Nam', dob: '2004-02-01', notes: '' },
        { id: '2251061834', name: 'Nguyễn Văn Trường', email: 'truongnguyen234@gmail.com', gender: 'Nam', dob: '2004-12-21', notes: '' },
        { id: '2251061900', name: 'Vũ Hương Giang', email: 'yangdo14@gmail.com', gender: 'Nữ', dob: '2004-08-29', notes: '' }
    ];
    let editMode = false;
    let studentToEditId = null;
    const showAlert = (message, type) => {
        const wrapper = document.createElement('div');
        wrapper.innerHTML = `
            <div class="alert alert-${type} alert-dismissible" role="alert">
                ${message}
                <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
            </div>
        `;
        alertPlaceholder.innerHTML = ''; 
        alertPlaceholder.append(wrapper);
        setTimeout(() => {
            wrapper.remove();
        }, 3000);
    };
    const renderStudents = () => {
        studentList.innerHTML = ''; 
        students.forEach((student, index) => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${index + 1}</td>
                <td>${student.id}</td>
                <td>${student.name}</td>
                <td>${student.email}</td>
                <td>${student.gender}</td>
                <td>${student.dob}</td>
                <td>
                    <button class="btn btn-warning btn-sm btn-edit" data-id="${student.id}">Sửa</button>
                    <button class="btn btn-danger btn-sm btn-delete" data-id="${student.id}">Xoá</button>
                </td>
            `;
            studentList.appendChild(row);
        });
    };
    const validateForm = () => {
        const msv = msvInput.value.trim();
        const ten = tenInput.value.trim();
        const email = emailInput.value.trim();
        const ngaysinh = ngaysinhInput.value.trim();
        if (!msv || !ten || !email || !ngaysinh) {
            showAlert('Vui lòng điền đầy đủ các trường bắt buộc (Mã SV, Họ tên, Email, Ngày sinh).', 'danger');
            return false;
        }
        if (ten.length < 5) {
            showAlert('Họ và tên phải có ít nhất 5 ký tự.', 'danger');
            return false;
        }
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            showAlert('Email không hợp lệ.', 'danger');
            return false;
        }
        if (!editMode && students.some(student => student.id === msv)) {
            showAlert('Mã sinh viên đã tồn tại.', 'danger');
            return false;
        }
        return true;
    };
    studentForm.addEventListener('submit', (e) => {
        e.preventDefault(); 

        if (!validateForm()) {
            return;
        }

        const studentData = {
            id: msvInput.value.trim(),
            name: tenInput.value.trim(),
            email: emailInput.value.trim(),
            gender: document.querySelector('input[name="gioitinh"]:checked').value,
            dob: ngaysinhInput.value,
            notes: ghichuInput.value.trim()
        };

        if (editMode) {
            const index = students.findIndex(s => s.id === studentToEditId);
            if (index !== -1) {
                students[index] = { ...studentData, id: studentToEditId };
            }
            showAlert('Cập nhật thông tin sinh viên thành công!', 'success');
            resetFormState();
        } else {
            students.push(studentData);
            showAlert('Thêm sinh viên mới thành công!', 'success');
        }

        renderStudents();
        studentForm.reset();
    });
    studentList.addEventListener('click', (e) => {
        const target = e.target;
        const id = target.dataset.id;

        if (target.classList.contains('btn-delete')) {
            if (confirm(`Bạn có chắc chắn muốn xoá sinh viên có mã ${id}?`)) {
                students = students.filter(student => student.id !== id);
                renderStudents();
                // showAlert(`Đã xoá sinh viên có mã ${id}.`, 'info');
                showAlert(`Đã xoá sinh viên thành công!`, 'info');
                if(editMode && studentToEditId === id) {
                    resetFormState();
                    studentForm.reset();
                }
            }
        }

        if (target.classList.contains('btn-edit')) {
            const studentToEdit = students.find(student => student.id === id);
            if (studentToEdit) {
                msvInput.value = studentToEdit.id;
                tenInput.value = studentToEdit.name;
                emailInput.value = studentToEdit.email;
                ngaysinhInput.value = studentToEdit.dob;
                ghichuInput.value = studentToEdit.notes;
                document.querySelector(`input[name="gioitinh"][value="${studentToEdit.gender}"]`).checked = true;
                editMode = true;
                studentToEditId = studentToEdit.id;
                msvInput.readOnly = true; 
                formTitle.textContent = 'Cập nhật thông tin sinh viên';
                submitBtn.textContent = 'Cập nhật';
                submitBtn.classList.replace('btn-primary', 'btn-success');
                window.scrollTo(0, 0);
            }
        }
    });
    const resetFormState = () => {
        editMode = false;
        studentToEditId = null;
        msvInput.readOnly = false;
        formTitle.textContent = 'Thêm sinh viên';
        submitBtn.textContent = 'Thêm sinh viên';
        submitBtn.classList.replace('btn-success', 'btn-primary');
    }
    renderStudents();
});