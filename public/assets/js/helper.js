function formatRupiah (input) {
    return new Intl.NumberFormat("id-ID", {
        style: "currency",
        currency: "IDR"
    }).format(input);
}

function hapus(url){
    const swalWithCustomBtn = Swal.mixin({
            customClass: {
            confirmButton: "btn btn-danger m-2",
            cancelButton: "btn btn-primary m-2"
        },
        buttonsStyling: false
    });

    swalWithCustomBtn.fire({
        title: "Are you sure?",
        text: "You won't be able to revert this!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "Yes, delete it!"
    }).then((result) => {
        if (result.isConfirmed) {
            swalWithCustomBtn.fire({
                title: "Deleted!",
                text: "Data has been deleted.",
                icon: "success",
                showConfirmButton: false,
            });
            setTimeout(()=>{
                window.location.href = url
            }, 1200);
            
        }
    });
}